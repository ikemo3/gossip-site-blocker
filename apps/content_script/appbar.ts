import { $ } from "../libs/dom";
import { Logger } from "../libs/logger";
import { BlockReasonType } from "../model/block_reason";
import {
  DisplayTemporarilyUnblockAll,
  ShowBlockedByWordInfo,
} from "../storage/options";

function temporarilyUnblockAll(): void {
  const anchorList = document.querySelectorAll(".blocker-temporarily-unblock");

  for (const anchor of anchorList) {
    if (anchor instanceof HTMLAnchorElement) {
      if (anchor.style.display !== "none") {
        anchor.click();
      }
    }
  }
}

function showBlockedByBannedWords(): void {
  const id = "urls_by_banned_words";

  const currentTextArea = document.getElementById(id);
  if (currentTextArea) {
    $.removeSelf(currentTextArea);
    return;
  }

  const lines = window.blockReasons
    .map((reason) => {
      if (reason.getType() === BlockReasonType.WORD) {
        return reason.getUrl();
      }
      return undefined;
    })
    .filter((v) => v); // remove undefined.

  // create textarea after 'topstuff'
  const textarea = $.textarea(lines.join("\n"), {
    cols: 70,
    id,
    rows: 10,
  });

  const bannedWordsDiv = document.getElementById("banned-words-div");

  if (bannedWordsDiv === null) {
    throw new Error("topstuff: no banned words div found");
  }

  bannedWordsDiv.appendChild(textarea);
}

async function appendTemporarilyUnblockAllAnchor(
  element: Element,
): Promise<void> {
  const display = await DisplayTemporarilyUnblockAll.load();
  if (display) {
    const anchor = $.anchor($.message("temporarilyUnblockAll"));
    $.onclick(anchor, temporarilyUnblockAll);

    element.appendChild(anchor);
  }
}

async function appendShowBlockedByWordInfoAnchor(
  element: Element,
): Promise<void> {
  const bannedWordOption = await ShowBlockedByWordInfo.load();
  if (bannedWordOption) {
    const showInfo = $.anchor($.message("showBlockedByWordInfo"));
    showInfo.style.marginLeft = "1rem";
    $.onclick(showInfo, showBlockedByBannedWords);
    element.appendChild(showInfo);
  }
}

async function createAppbarLinks(): Promise<void> {
  const topStuff = document.getElementById("topstuff");
  if (topStuff !== null) {
    const gsbToolbar = $.div();
    gsbToolbar.setAttribute("id", "gsb-toolbar");
    await createAppbarContents(gsbToolbar);

    // insert gsbToolbar after topStuff
    topStuff.parentElement!.insertBefore(gsbToolbar, topStuff.nextSibling);
    return;
  }

  // for image search
  const imageSearchDiv = document.querySelector("div.mJxzWe");
  if (imageSearchDiv !== null) {
    const gsbToolbar = $.div();
    gsbToolbar.setAttribute("id", "gsb-toolbar");
    gsbToolbar.style.paddingLeft = "20px";
    await createAppbarContents(gsbToolbar);

    // insert gsbToolbar before mJxzWe
    imageSearchDiv.parentElement!.insertBefore(gsbToolbar, imageSearchDiv);
    return;
  } else {
    Logger.debug("topstuff: no image search div found");
    return;
  }
}

async function createAppbarContents(gsbToolbar: HTMLDivElement): Promise<void> {
  // add icon
  const iconUrl = chrome.runtime.getURL("icons/icon-12.png");
  const iconImg: HTMLImageElement = document.createElement("img");
  iconImg.src = iconUrl;
  iconImg.style.marginRight = "0.5rem";
  gsbToolbar.appendChild(iconImg);

  // create div for links
  await appendTemporarilyUnblockAllAnchor(gsbToolbar);
  await appendShowBlockedByWordInfoAnchor(gsbToolbar);

  // create div for banned words
  const bannedWordsDiv = $.div();
  bannedWordsDiv.setAttribute("id", "banned-words-div");
  gsbToolbar.appendChild(bannedWordsDiv);
}

export default createAppbarLinks;
