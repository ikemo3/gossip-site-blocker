import BlockedSites from '../model/blocked_sites';
import { BannedWordRepository, BannedWord } from '../repository/banned_word_repository';
import { RegExpItem, RegExpRepository } from '../repository/regexp_repository';
import { AutoBlockIDNOption, BannedWordOption, OptionRepository } from '../repository/config';
import { Logger, MenuPosition } from '../common';
import { BlockReason } from '../model/block_reason';
import BlockedSitesRepository from '../repository/blocked_sites';
import GoogleSearchResult from '../block/google_search_result';
import BlockState from '../content_script/block_state';
import BlockMediator from '../content_script/block_mediator';
import GoogleInnerCard from '../block/google_inner_card';
import GoogleTopNews from '../block/google_top_news';
import GoogleNewsTabCardSection from '../block/google_news_tab_card_section';
import GoogleNewsTabTop from '../block/google_news_tab_top';
import { SearchResultToBlock } from '../block/block';

export interface Options {
    blockedSites: BlockedSites;
    bannedWords: BannedWord[];
    regexpList: RegExpItem[];
    idnOption: AutoBlockIDNOption;
    defaultBlockType: string;
    menuPosition: MenuPosition;
    bannedWordOption: BannedWordOption;
    blockGoogleNewsTab: boolean;
}

declare global {
    interface Window {
        blockReasons: BlockReason[];
    }
}

window.blockReasons = [];

// This is necessary when using the back button.
let gsbOptions: Options | null = null;
const pendingGoogleSearchResultList: Element[] = [];
const pendingGoogleInnerCardList: Element[] = [];
const pendingGoogleTopNewsList: Element[] = [];
const pendingGoogleNewsTabCardSectionList: Element[] = [];
const pendingGoogleNewsTabTopList: Element[] = [];
const subObserverList: MutationObserver[] = [];

type IBlockFunction = (g: SearchResultToBlock, options: Options) => boolean;

function blockClosure(node: SearchResultToBlock, options: Options,
    blockFunc: IBlockFunction): () => void {
    let completed = false;
    return (): void => {
        if (completed) {
            return;
        }

        completed = blockFunc(node, options);
    };
}

function tryBlockElement(g: SearchResultToBlock, options: Options,
    blockFunction: IBlockFunction): void {
    // first, try block.
    const completed = blockFunction(g, options);
    if (completed) {
        return;
    }

    // if failed, add observer for retry.
    const block = blockClosure(g, options, blockFunction);
    const subObserver = new MutationObserver(() => {
        block();
    });

    subObserver.observe(g.getElement(), { childList: true, subtree: true });
    subObserverList.push(subObserver);
}

function blockElement(g: SearchResultToBlock, options: Options): boolean {
    if (!g.canRetry()) {
        return true;
    }

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords,
        options.regexpList, options.idnOption);

    if (blockState.getReason()) {
        window.blockReasons.push(blockState.getReason()!);
    }

    if (blockState.getState() === 'hard') {
        g.deleteElement();
        return true;
    }

    const _ = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}

function tryBlock(node: SearchResultToBlock, options: Options): void {
    tryBlockElement(node, options, blockElement);
}

// add observer
const observer = new MutationObserver((mutations) => {
    const params = (new URL(document.location.href)).searchParams;
    const isGoogleNews = params.get('tbm') === 'nws';

    mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
                const isGoogleNewsCardSection = node.matches('div.card-section');
                const isGoogleNewsTop = node.matches('div.gG0TJc');

                if (isGoogleNewsCardSection && isGoogleNews) {
                    if (gsbOptions !== null) {
                        if (gsbOptions.blockGoogleNewsTab) {
                            const g = new GoogleNewsTabCardSection(node);
                            tryBlock(g, gsbOptions);
                        }
                    } else {
                        pendingGoogleNewsTabCardSectionList.push(node);
                    }
                } else if (isGoogleNewsTop && isGoogleNews) {
                    if (gsbOptions !== null) {
                        if (gsbOptions.blockGoogleNewsTab) {
                            const g = new GoogleNewsTabTop(node);
                            tryBlock(g, gsbOptions);
                        }
                    } else {
                        pendingGoogleNewsTabTopList.push(node);
                    }
                } else if (node.classList.contains('g') && !isGoogleNews) {
                    if (gsbOptions !== null) {
                        const g = new GoogleSearchResult(node);
                        tryBlock(g, gsbOptions);
                    } else {
                        pendingGoogleSearchResultList.push(node);
                    }
                } else if (node.nodeName.toLowerCase() === 'g-inner-card') {
                    if (gsbOptions !== null) {
                        const g = new GoogleInnerCard(node);
                        tryBlock(g, gsbOptions);
                    } else {
                        pendingGoogleInnerCardList.push(node);
                    }
                } else if (node.classList.contains('dbsr')) {
                    if (gsbOptions !== null) {
                        const g = new GoogleTopNews(node);
                        tryBlock(g, gsbOptions);
                    } else {
                        pendingGoogleTopNewsList.push(node);
                    }
                }
            }
        }
    });
});

const config = { childList: true, subtree: true };
observer.observe(document.documentElement, config);

(async (): Promise<void> => {
    const blockedSites: BlockedSites = await BlockedSitesRepository.load();
    const bannedWords: BannedWord[] = await BannedWordRepository.load();
    const regexpList: RegExpItem[] = await RegExpRepository.load();
    const idnOption = await OptionRepository.getAutoBlockIDNOption();
    const defaultBlockType: string = await OptionRepository.defaultBlockType();
    const menuPosition: MenuPosition = await OptionRepository.menuPosition();
    const bannedWordOption: BannedWordOption = await OptionRepository.getBannedWordOption();
    const blockGoogleNewsTab: boolean = await OptionRepository.isBlockGoogleNewsTab();
    Logger.debug('autoBlockIDNOption:', idnOption);

    gsbOptions = {
        blockedSites,
        bannedWords,
        regexpList,
        idnOption,
        defaultBlockType,
        menuPosition,
        bannedWordOption,
        blockGoogleNewsTab,
    };

    for (const node of pendingGoogleSearchResultList) {
        const g = new GoogleSearchResult(node);
        tryBlock(g, gsbOptions);
    }

    for (const node of pendingGoogleInnerCardList) {
        const g = new GoogleInnerCard(node);
        tryBlock(g, gsbOptions);
    }

    for (const node of pendingGoogleTopNewsList) {
        const g = new GoogleTopNews(node);
        tryBlock(g, gsbOptions);
    }

    for (const node of pendingGoogleNewsTabCardSectionList) {
        if (gsbOptions.blockGoogleNewsTab) {
            const g = new GoogleNewsTabCardSection(node);
            tryBlock(g, gsbOptions);
        }
    }

    for (const node of pendingGoogleNewsTabTopList) {
        if (gsbOptions.blockGoogleNewsTab) {
            const g = new GoogleNewsTabTop(node);
            tryBlock(g, gsbOptions);
        }
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // clear sub-observer
    for (const subObserver of subObserverList) {
        subObserver.disconnect();
    }
});
