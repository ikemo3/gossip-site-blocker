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

type IBlockFunction = (g1: Element, options: Options) => boolean;

function blockClosure(node: Element, options: Options, blockFunc: IBlockFunction): () => void {
    let completed = false;
    return (): void => {
        if (completed) {
            return;
        }

        completed = blockFunc(node, options);
    };
}

function tryBlockElement(node: Element, options: Options, blockFunction: IBlockFunction): void {
    // first, try block.
    const completed = blockFunction(node, options);
    if (completed) {
        return;
    }

    // if failed, add observer for retry.
    const block = blockClosure(node, options, blockFunction);
    const subObserver = new MutationObserver(() => {
        block();
    });

    subObserver.observe(node, { childList: true, subtree: true });
    subObserverList.push(subObserver);
}

function blockGoogleSearchResult(g1: Element, options: Options): boolean {
    const g = new GoogleSearchResult(g1);

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

function blockGoogleInnerCard(g1: Element, options: Options): boolean {
    const g = new GoogleInnerCard(g1);

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

function blockGoogleTopNews(g1: Element, options: Options): boolean {
    const g = new GoogleTopNews(g1);

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

function blockGoogleNewsTabCardSection(g1: Element, options: Options): boolean {
    const g = new GoogleNewsTabCardSection(g1);

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

function blockGoogleNewsTabTop(g1: Element, options: Options): boolean {
    const g = new GoogleNewsTabTop(g1);

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

function tryBlockGoogleSearchResult(node: Element, options: Options): void {
    tryBlockElement(node, options, blockGoogleSearchResult);
}

function tryBlockGoogleInnerCard(node: Element, options: Options): void {
    tryBlockElement(node, options, blockGoogleInnerCard);
}

function tryBlockGoogleTopNews(node: Element, options: Options): void {
    tryBlockElement(node, options, blockGoogleTopNews);
}

function tryBlockGoogleNewsTabCardSection(node: Element, options: Options): void {
    if (options.blockGoogleNewsTab) {
        tryBlockElement(node, options, blockGoogleNewsTabCardSection);
    }
}

function tryBlockGoogleNewsTabTop(node: Element, options: Options): void {
    if (options.blockGoogleNewsTab) {
        tryBlockElement(node, options, blockGoogleNewsTabTop);
    }
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
                        tryBlockGoogleNewsTabCardSection(node, gsbOptions);
                    } else {
                        pendingGoogleNewsTabCardSectionList.push(node);
                    }
                } else if (isGoogleNewsTop && isGoogleNews) {
                    if (gsbOptions !== null) {
                        tryBlockGoogleNewsTabTop(node, gsbOptions);
                    } else {
                        pendingGoogleNewsTabTopList.push(node);
                    }
                } else if (node.classList.contains('g') && !isGoogleNews) {
                    if (gsbOptions !== null) {
                        tryBlockGoogleSearchResult(node, gsbOptions);
                    } else {
                        pendingGoogleSearchResultList.push(node);
                    }
                } else if (node.nodeName.toLowerCase() === 'g-inner-card') {
                    if (gsbOptions !== null) {
                        tryBlockGoogleInnerCard(node, gsbOptions);
                    } else {
                        pendingGoogleInnerCardList.push(node);
                    }
                } else if (node.classList.contains('dbsr')) {
                    if (gsbOptions !== null) {
                        tryBlockGoogleTopNews(node, gsbOptions);
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
        tryBlockGoogleSearchResult(node, gsbOptions);
    }

    for (const node of pendingGoogleInnerCardList) {
        tryBlockGoogleInnerCard(node, gsbOptions);
    }

    for (const node of pendingGoogleTopNewsList) {
        tryBlockGoogleTopNews(node, gsbOptions);
    }

    for (const node of pendingGoogleNewsTabCardSectionList) {
        tryBlockGoogleNewsTabCardSection(node, gsbOptions);
    }

    for (const node of pendingGoogleNewsTabTopList) {
        tryBlockGoogleNewsTabTop(node, gsbOptions);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // clear sub-observer
    for (const subObserver of subObserverList) {
        subObserver.disconnect();
    }
});
