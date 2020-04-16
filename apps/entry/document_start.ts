import BlockedSites from '../model/blocked_sites';
import { BannedWord, BannedWordRepository } from '../repository/banned_word_repository';
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
const pendingGoogleNewsTabCardSectionList: Element[] = [];
const pendingGoogleNewsTabTopList: Element[] = [];

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
                            if (!blockElement(g, gsbOptions)) {
                                pendingGoogleNewsTabCardSectionList.push(node);
                            }
                        }
                    } else {
                        pendingGoogleNewsTabCardSectionList.push(node);
                    }
                } else if (GoogleNewsTabTop.isCandidate(node, documentURL)) {
                    if (gsbOptions !== null) {
                        if (GoogleNewsTabTop.isOptionallyEnabled(gsbOptions)) {
                            const g = new GoogleNewsTabTop(node);
                            if (!blockElement(g, gsbOptions)) {
                                pendingGoogleNewsTabTopList.push(node);
                            }
                        }
                    } else {
                        pendingGoogleNewsTabTopList.push(node);
                    }
                } else if (GoogleSearchResult.isCandidate(node, documentURL)) {
                    if (gsbOptions !== null) {
                        const g = new GoogleSearchResult(node);
                        if (!blockElement(g, gsbOptions)) {
                            pendingGoogleSearchResultList.push(node);
                        }
                    } else {
                        pendingGoogleSearchResultList.push(node);
                    }
                } else if (GoogleSearchInnerCard.isCandidate(node, documentURL)) {
                    if (gsbOptions !== null) {
                        const g = new GoogleSearchInnerCard(node);
                        if (!blockElement(g, gsbOptions)) {
                            pendingGoogleSearchInnerCardList.push(node);
                        }
                    } else {
                        pendingGoogleSearchInnerCardList.push(node);
                    }
                } else if (GoogleSearchTopNews.isCandidate(node, documentURL)) {
                    if (gsbOptions !== null) {
                        const g = new GoogleSearchTopNews(node);
                        if (!blockElement(g, gsbOptions)) {
                            pendingGoogleSearchTopNewsList.push(node);
                        }
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

    for (const node of pendingGoogleSearchResultList) {
        const g = new GoogleSearchResult(node);
        blockElement(g, gsbOptions);
    }

    for (const node of pendingGoogleSearchInnerCardList) {
        const g = new GoogleSearchInnerCard(node);
        blockElement(g, gsbOptions);
    }

    for (const node of pendingGoogleSearchTopNewsList) {
        const g = new GoogleSearchTopNews(node);
        blockElement(g, gsbOptions);
    }

    for (const node of pendingGoogleNewsTabCardSectionList) {
        if (GoogleNewsTabCardSection.isOptionallyEnabled(gsbOptions)) {
            const g = new GoogleNewsTabCardSection(node);
            blockElement(g, gsbOptions);
        }
    }

    for (const node of pendingGoogleNewsTabTopList) {
        if (GoogleNewsTabTop.isOptionallyEnabled(gsbOptions)) {
            const g = new GoogleNewsTabTop(node);
            blockElement(g, gsbOptions);
        }
    }
})();
