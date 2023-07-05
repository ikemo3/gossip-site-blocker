import BlockedSites from "../model/blocked_sites";
import { BannedWord, BannedWordRepository } from "../repository/banned_words";
import { RegExpItem, RegExpRepository } from "../repository/regexp_repository";
import { OptionRepository, Options } from "../repository/options";
import { Logger } from "../common";
import { BlockReason } from "../model/block_reason";
import BlockedSitesRepository from "../repository/blocked_sites";
import BlockState, { ContentToBlockType } from "../content_script/block_state";
import {
  BlockMediator,
  BlockMediatorType,
} from "../content_script/block_mediator";
import { GoogleSearchResult } from "../block/google_search_result";
import { GoogleSearchInnerCard } from "../block/google_search_inner_card";
import { GoogleSearchTopNews } from "../block/google_search_top_news";
import { GoogleNewsCard } from "../block/google_news_card";
import { GoogleNewsSectionWithHeader } from "../block/google_news_section_with_header";
import { GoogleNewsResult } from "../block/google_news_result";
import { GoogleImageTab } from "../block/google_image_tab";
import { GoogleSearchMovie } from "../block/google_search_movie";
import DocumentURL from "../values/document_url";
import { MenuPosition } from "../repository/enums";
import { SearchResultToBlock } from "../block/block";

declare global {
  interface Window {
    blockReasons: BlockReason[];
  }
}

window.blockReasons = [];

const pendingsList: SearchResultToBlock[] = [];

type SearchResultToBlockType = ContentToBlockType &
  BlockMediatorType & {
    canRetry: () => boolean;
    canBlock: () => boolean;
    deleteElement: () => void;
    getMenuPosition: (defaultPosition: MenuPosition) => MenuPosition;
  };

function blockElement(g: SearchResultToBlockType, options: Options): boolean {
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

  const _ = new BlockMediator(
    g,
    blockState,
    options.defaultBlockType,
    menuPosition
  );
  return true;
}

async function loadOption(): Promise<Options> {
  await OptionRepository.DeveloperMode.load();

  const blockedSites: BlockedSites = await BlockedSitesRepository.load();
  const bannedWords: BannedWord[] = await BannedWordRepository.load();
  const regexpList: RegExpItem[] = await RegExpRepository.load();
  const autoBlockIDN = await OptionRepository.AutoBlockIDN.load();
  const defaultBlockType: string =
    await OptionRepository.DefaultBlockType.load();
  const menuPosition: MenuPosition = await OptionRepository.MenuPosition.load();
  const bannedWordOption: boolean =
    await OptionRepository.ShowBlockedByWordInfo.load();
  const blockGoogleNewsTab: boolean =
    await OptionRepository.BlockGoogleNewsTab.load();
  const blockGoogleImagesTab: boolean =
    await OptionRepository.BlockGoogleImagesTab.load();
  const blockGoogleSearchMovie: boolean =
    await OptionRepository.BlockGoogleSearchMovie.load();
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
        processAddedNode(node, documentURL);
      }
    }
  });
});

const config = { childList: true, subtree: true };
observer.observe(document.documentElement, config);

(async (): Promise<void> => {
  for (const g of pendingsList) {
    blockElement(g, gsbOptions);
  }
})();

function processAddedNode(node: Element, documentURL: DocumentURL) {
  const blockTarget = processAddedNodeInternal(node, documentURL);
  if (blockTarget && !blockElement(blockTarget, gsbOptions)) {
    pendingsList.push(blockTarget);
  }
}

function processAddedNodeInternal(node: Element, documentURL: DocumentURL) {
  if (
    GoogleNewsSectionWithHeader.isCandidate(node, documentURL) &&
    GoogleNewsSectionWithHeader.isOptionallyEnabled(gsbOptions)
  ) {
    return new GoogleNewsSectionWithHeader(node);
  }

  if (
    GoogleNewsResult.isCandidate(node, documentURL) &&
    GoogleNewsResult.isOptionallyEnabled(gsbOptions)
  ) {
    return new GoogleNewsResult(node);
  }

  if (GoogleSearchResult.isCandidate(node, documentURL)) {
    return new GoogleSearchResult(node);
  }

  if (GoogleSearchInnerCard.isCandidate(node, documentURL)) {
    return new GoogleSearchInnerCard(node);
  }

  if (GoogleSearchTopNews.isCandidate(node, documentURL)) {
    return new GoogleSearchTopNews(node);
  }

  if (
    GoogleImageTab.isCandidate(node, documentURL) &&
    GoogleImageTab.isOptionallyEnabled(gsbOptions)
  ) {
    return new GoogleImageTab(node);
  }

  if (
    GoogleNewsCard.isCandidate(node, documentURL) &&
    GoogleNewsCard.isOptionallyEnabled(gsbOptions)
  ) {
    return new GoogleNewsCard(node);
  }

  if (
    GoogleSearchMovie.isCandidate(node, documentURL) &&
    GoogleSearchMovie.isOptionallyEnabled(gsbOptions)
  ) {
    return new GoogleSearchMovie(node);
  }
}
