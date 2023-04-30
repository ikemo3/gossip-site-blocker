import BlockedSites from "../model/blocked_sites";
import { BannedWord, BannedWordRepository } from "../repository/banned_words";
import { RegExpItem, RegExpRepository } from "../repository/regexp_repository";
import { OptionRepository, Options } from "../repository/options";
import { Logger } from "../common";
import { BlockReason } from "../model/block_reason";
import BlockedSitesRepository from "../repository/blocked_sites";
import GoogleSearchResult from "../block/google_search_result";
import BlockState from "../content_script/block_state";
import BlockMediator from "../content_script/block_mediator";
import GoogleSearchInnerCard from "../block/google_search_inner_card";
import GoogleSearchTopNews from "../block/google_search_top_news";
import GoogleNewsCard from "../block/google_news_card";
import GoogleNewsSectionWithHeader from "../block/google_news_section_with_header";
import GoogleNewsResult from "../block/google_news_result";
import GoogleImageTab from "../block/google_image_tab";
import GoogleSearchMovie from "../block/google_search_movie";
import { SearchResultToBlock } from "../block/block";
import DocumentURL from "../values/document_url";
import { MenuPosition } from "../repository/enums";

declare global {
    interface Window {
        blockReasons: BlockReason[];
    }
}

window.blockReasons = [];

// This is necessary when using the back button.
const pendingGoogleSearchResultList: Element[] = [];
const pendingGoogleSearchInnerCardList: Element[] = [];
const pendingGoogleSearchTopNewsList: Element[] = [];
const pendingGoogleNewsSectionWithHeaderList: Element[] = [];
const pendingGoogleNewsResultList: Element[] = [];
const pendingGoogleImageTabList: Element[] = [];
const pendingGoogleNewsCardList: Element[] = [];
const pendingGoogleSearchMovieList: Element[] = [];

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
        options.autoBlockIDN
    );

    if (blockState.getReason()) {
        window.blockReasons.push(blockState.getReason()!);
    }

    if (blockState.getState() === "hard") {
        g.deleteElement();
        return true;
    }

    const menuPosition = g.getMenuPosition(options.menuPosition);

    const _ = new BlockMediator(g, blockState, options.defaultBlockType, menuPosition);
    return true;
}

async function loadOption(): Promise<Options> {
    await OptionRepository.DeveloperMode.load();

    const blockedSites: BlockedSites = await BlockedSitesRepository.load();
    const bannedWords: BannedWord[] = await BannedWordRepository.load();
    const regexpList: RegExpItem[] = await RegExpRepository.load();
    const autoBlockIDN = await OptionRepository.AutoBlockIDN.load();
    const defaultBlockType: string = await OptionRepository.DefaultBlockType.load();
    const menuPosition: MenuPosition = await OptionRepository.MenuPosition.load();
    const bannedWordOption: boolean = await OptionRepository.ShowBlockedByWordInfo.load();
    const blockGoogleNewsTab: boolean = await OptionRepository.BlockGoogleNewsTab.load();
    const blockGoogleImagesTab: boolean = await OptionRepository.BlockGoogleImagesTab.load();
    const blockGoogleSearchMovie: boolean = await OptionRepository.BlockGoogleSearchMovie.load();
    Logger.debug("autoBlockIDNOption:", autoBlockIDN);

    return {
        blockedSites,
        bannedWords,
        regexpList,
        autoBlockIDN,
        defaultBlockType,
        menuPosition,
        bannedWordOption,
        blockGoogleNewsTab,
        blockGoogleImagesTab,
        blockGoogleSearchMovie,
    };
}

const gsbOptions: Options = await loadOption();

// add observer
const observer = new MutationObserver((mutations) => {
    const documentURL = new DocumentURL(document.location.href);

    mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
                if (GoogleNewsSectionWithHeader.isCandidate(node, documentURL)) {
                    if (GoogleNewsSectionWithHeader.isOptionallyEnabled(gsbOptions)) {
                        const g = new GoogleNewsSectionWithHeader(node);
                        if (!blockElement(g, gsbOptions)) {
                            pendingGoogleNewsSectionWithHeaderList.push(node);
                        }
                    }
                } else if (GoogleNewsResult.isCandidate(node, documentURL)) {
                    if (GoogleNewsResult.isOptionallyEnabled(gsbOptions)) {
                        const g = new GoogleNewsResult(node);
                        if (!blockElement(g, gsbOptions)) {
                            pendingGoogleNewsResultList.push(node);
                        }
                    }
                } else if (GoogleSearchResult.isCandidate(node, documentURL)) {
                    const g = new GoogleSearchResult(node);
                    if (!blockElement(g, gsbOptions)) {
                        pendingGoogleSearchResultList.push(node);
                    }
                } else if (GoogleSearchInnerCard.isCandidate(node, documentURL)) {
                    const g = new GoogleSearchInnerCard(node);
                    if (!blockElement(g, gsbOptions)) {
                        pendingGoogleSearchInnerCardList.push(node);
                    }
                } else if (GoogleSearchTopNews.isCandidate(node, documentURL)) {
                    const g = new GoogleSearchTopNews(node);
                    if (!blockElement(g, gsbOptions)) {
                        pendingGoogleSearchTopNewsList.push(node);
                    }
                } else if (GoogleImageTab.isCandidate(node, documentURL)) {
                    if (GoogleImageTab.isOptionallyEnabled(gsbOptions)) {
                        const g = new GoogleImageTab(node);
                        if (!blockElement(g, gsbOptions)) {
                            pendingGoogleImageTabList.push(node);
                        }
                    }
                } else if (GoogleNewsCard.isCandidate(node, documentURL)) {
                    if (GoogleNewsCard.isOptionallyEnabled(gsbOptions)) {
                        const g = new GoogleNewsCard(node);
                        if (!blockElement(g, gsbOptions)) {
                            pendingGoogleNewsCardList.push(node);
                        }
                    }
                } else if (GoogleSearchMovie.isCandidate(node, documentURL)) {
                    if (GoogleSearchMovie.isOptionallyEnabled(gsbOptions)) {
                        const g = new GoogleSearchMovie(node);
                        if (!blockElement(g, gsbOptions)) {
                            pendingGoogleSearchMovieList.push(node);
                        }
                    }
                }
            }
        }
    });
});

const config = { childList: true, subtree: true };
observer.observe(document.documentElement, config);

(async (): Promise<void> => {
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

    for (const node of pendingGoogleNewsSectionWithHeaderList) {
        const g = new GoogleNewsSectionWithHeader(node);
        blockElement(g, gsbOptions);
    }

    for (const node of pendingGoogleNewsResultList) {
        const g = new GoogleNewsResult(node);
        blockElement(g, gsbOptions);
    }

    for (const node of pendingGoogleImageTabList) {
        const g = new GoogleImageTab(node);
        blockElement(g, gsbOptions);
    }

    for (const node of pendingGoogleNewsCardList) {
        const g = new GoogleNewsCard(node);
        blockElement(g, gsbOptions);
    }

    for (const node of pendingGoogleSearchMovieList) {
        const g = new GoogleSearchMovie(node);
        blockElement(g, gsbOptions);
    }
})();
