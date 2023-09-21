import { Options } from "../storage/options";
import { BlockReason } from "../model/block_reason";
import DocumentURL from "../values/document_url";
import { SearchResultToBlock } from "../block/contents";
import { blockElement } from "../content_script/block_element";
import { detectContents } from "../block/detector";
import { loadOption } from "../storage/options";

declare global {
  interface Window {
    blockReasons: BlockReason[];
  }
}

window.blockReasons = [];

const pendingsList: SearchResultToBlock[] = [];

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
  const contents = detectContents(node, documentURL, gsbOptions);
  if (contents) {
    const { ended, reason } = blockElement(contents, gsbOptions);

    if (reason) {
      window.blockReasons.push(reason);
    }

    if (!ended) {
      pendingsList.push(contents);
    }
  }
}
