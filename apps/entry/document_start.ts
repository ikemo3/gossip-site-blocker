import { SearchResultToBlock } from "../block/contents";
import { detectContents } from "../block/detector";
import { blockElement } from "../content_script/block_element";
import { Logger } from "../libs/logger";
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
        if (
          node.hasAttribute("data-async-context") &&
          node.getAttribute("data-async-context")?.startsWith("query:")
        ) {
          node.querySelectorAll(".g").forEach((g) => {
            processAddedNode(g, documentURL);
          });
        } else {
          processAddedNode(node, documentURL);
        }
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
    Logger.debug(
      "[GSB] Blocking element:",
      contents.constructor.name,
      "URL:",
      contents.getUrl(),
      "Title:",
      contents.getTitle(),
    );
    const { ended, reason } = blockElement(contents, gsbOptions);
    Logger.debug(
      "[GSB] Block result - ended:",
      ended,
      "reason:",
      reason?.getReason() ?? (ended ? "not blocked" : "no reason"),
    );

    if (reason) {
      window.blockReasons.push(reason);
    }

    if (!ended) {
      pendingsList.push(contents);
    }
  }
}

processPendings();
