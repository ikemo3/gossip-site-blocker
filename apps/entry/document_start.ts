import { SearchResultToBlock } from "../block/contents";
import { detectContents } from "../block/detector";
import { blockElement } from "../content_script/block_element";
import { BlockReason } from "../model/block_reason";
import { Options } from "../storage/options";
import { loadOption } from "../storage/options";
import DocumentURL from "../values/document_url";

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

function processPendings() {
  const tmpList = [...pendingsList];
  pendingsList.length = 0;

  for (const g of tmpList) {
    blockElement(g, gsbOptions);
  }
}

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

processPendings();
