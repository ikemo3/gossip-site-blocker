import BlockedSites from '../model/blocked_sites';
import { BannedWordRepository, BannedWord } from '../repository/banned_word_repository';
import { RegExpItem, RegExpRepository } from '../repository/regexp_repository';
import { BannedWordOption, OptionRepository, Options } from '../repository/config';
import { Logger, MenuPosition } from '../common';
import { BlockReason } from '../model/block_reason';
import BlockedSitesRepository from '../repository/blocked_sites';
import GoogleSearchResult from '../block/google_search_result';
import BlockState from '../content_script/block_state';
import BlockMediator from '../content_script/block_mediator';
import GoogleSearchInnerCard from '../block/google_search_inner_card';
import GoogleSearchTopNews from '../block/google_search_top_news';
import GoogleNewsTabCardSection from '../block/google_news_tab_card_section';
import GoogleNewsTabTop from '../block/google_news_tab_top';
import { SearchResultToBlock } from '../block/block';
import DocumentURL from '../values/document_url';

declare global {
    interface Window {
        blockReasons: BlockReason[];
    }
}

window.blockReasons = [];

// This is necessary when using the back button.
let gsbOptions: Options | null = null;
const pendingGoogleSearchResultList: Element[] = [];
const pendingGoogleSearchInnerCardList: Element[] = [];
const pendingGoogleSearchTopNewsList: Element[] = [];
const pendingList: Element[] = [];
const subObserverList: MutationObserver[] = [];

type IBlockFunction = (g: SearchResultToBlock, options: Options) => boolean;

function blockElement(g: SearchResultToBlock, options: Options): boolean {
    if (!g.canRetry()) {
        return true;
    }

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(
        g,
        options.blockedSites,
        options.bannedWords,
        options.regexpList,
        options.idnOption,
    );

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

function blockClosure(node: SearchResultToBlock, options: Options): () => void {
    let completed = false;
    return (): void => {
        if (completed) {
            return;
        }

        completed = blockElement(node, options);
    };
}

function tryBlockElement(g: SearchResultToBlock, options: Options): void {
    // first, try block.
    const completed = blockElement(g, options);
    if (completed) {
        return;
    }

    // if failed, add observer for retry.
    const block = blockClosure(g, options);
    const subObserver = new MutationObserver(() => {
        block();
    });

    subObserver.observe(g.getElement(), { childList: true, subtree: true });
    subObserverList.push(subObserver);
}

// add observer
const observer = new MutationObserver((mutations) => {
    const documentURL = new DocumentURL();

    mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
                if (GoogleNewsTabCardSection.isCandidate(node, documentURL)) {
                    if (gsbOptions !== null) {
                        if (GoogleNewsTabCardSection.isOptionallyEnabled(gsbOptions)) {
                            const g = new GoogleNewsTabCardSection(node);
                            tryBlockElement(g, gsbOptions);
                        }
                    } else {
                        pendingList.push(node);
                    }
                } else if (GoogleNewsTabTop.isCandidate(node, documentURL)) {
                    if (gsbOptions !== null) {
                        if (GoogleNewsTabTop.isOptionallyEnabled(gsbOptions)) {
                            const g = new GoogleNewsTabTop(node);
                            tryBlockElement(g, gsbOptions);
                        }
                    } else {
                        pendingList.push(node);
                    }
                } else if (GoogleSearchResult.isCandidate(node, documentURL)) {
                    if (gsbOptions !== null) {
                        const g = new GoogleSearchResult(node);
                        tryBlockElement(g, gsbOptions);
                    } else {
                        pendingGoogleSearchResultList.push(node);
                    }
                } else if (GoogleSearchInnerCard.isCandidate(node, documentURL)) {
                    if (gsbOptions !== null) {
                        const g = new GoogleSearchInnerCard(node);
                        tryBlockElement(g, gsbOptions);
                    } else {
                        pendingGoogleSearchInnerCardList.push(node);
                    }
                } else if (GoogleSearchTopNews.isCandidate(node, documentURL)) {
                    if (gsbOptions !== null) {
                        const g = new GoogleSearchTopNews(node);
                        tryBlockElement(g, gsbOptions);
                    } else {
                        pendingGoogleSearchTopNewsList.push(node);
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

    const options = gsbOptions;
    const classes = [
        GoogleSearchResult,
        GoogleSearchInnerCard,
        GoogleSearchTopNews,
        GoogleNewsTabCardSection,
        GoogleNewsTabTop,
    ];
    classes.forEach((Klass) => {
        for (const node of pendingList) {
            if (Klass.isOptionallyEnabled(options)) {
                const g = new Klass(node);
                tryBlockElement(g, options);
            }
        }
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    // clear sub-observer
    for (const subObserver of subObserverList) {
        subObserver.disconnect();
    }
});
