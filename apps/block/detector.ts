import { Logger } from "../libs/logger";
import { Options } from "../storage/options";
import DocumentURL from "../values/document_url";
import { GoogleImageTab } from "./google_image_tab";
import { GoogleNewsCard } from "./google_news_card";
import { GoogleNewsResult } from "./google_news_result";
import { GoogleNewsSectionWithHeader } from "./google_news_section_with_header";
import { GoogleSearchInnerCard } from "./google_search_inner_card";
import { GoogleSearchMovie } from "./google_search_movie";
import { GoogleSearchResult } from "./google_search_result";
import { GoogleSearchTopNews } from "./google_search_top_news";

export function detectContents(
  node: Element,
  documentURL: DocumentURL,
  options: Options,
) {
  if (
    options.blockGoogleNewsTab &&
    GoogleNewsSectionWithHeader.isCandidate(node, documentURL)
  ) {
    return new GoogleNewsSectionWithHeader(node);
  }

  if (
    options.blockGoogleNewsTab &&
    GoogleNewsResult.isCandidate(node, documentURL)
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
    options.blockGoogleImagesTab &&
    GoogleImageTab.isCandidate(node, documentURL)
  ) {
    Logger.debug("[GSB] GoogleImageTab candidate found:", node.className);
    const imageTab = new GoogleImageTab(node);
    Logger.debug(
      "[GSB] GoogleImageTab created - canBlock:",
      imageTab.canBlock(),
    );
    return imageTab;
  }

  if (
    options.blockGoogleNewsTab &&
    GoogleNewsCard.isCandidate(node, documentURL)
  ) {
    return new GoogleNewsCard(node);
  }

  if (
    options.blockGoogleSearchMovie &&
    GoogleSearchMovie.isCandidate(node, documentURL)
  ) {
    return new GoogleSearchMovie(node);
  }
}
