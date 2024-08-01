import { Logger } from "../libs/logger";
import BannedWords from "../page/option/banned_word";
import BlockedSiteOption from "../page/option/blocked_site_option";
import exportClicked from "../page/option/export";
import importClicked from "../page/option/import";
import localizeHtmlPage from "../page/option/l10n";
import RegExpList from "../page/option/regexp";
import { BannedWordRepository } from "../storage/banned_words";
import BlockedSitesRepository from "../storage/blocked_sites";
import {
  AutoBlockIDN,
  BlockGoogleImagesTab,
  BlockGoogleNewsTab,
  BlockGoogleSearchMovie,
  DefaultBlockType,
  DeveloperMode,
  DisplayTemporarilyUnblockAll,
  MenuPosition,
  OptionInterface,
  ShowBlockedByWordInfo,
} from "../storage/options";
import { RegExpRepository } from "../storage/regexp_repository";

const softBlockList = assertDivElement(
  document.getElementById("softBlockList"),
);
const hardBlockList = assertDivElement(
  document.getElementById("hardBlockList"),
);
const clearButton = assertInputElement(document.getElementById("clearButton"));

function assertInputElement(element: HTMLElement | null): HTMLInputElement {
  if (!element) {
    throw new Error("Input is null");
  }
  if (!(element instanceof HTMLInputElement)) {
    throw new Error("Input is not HTMLInputElement");
  }
  return element;
}

function assertDivElement(element: HTMLElement | null): HTMLDivElement {
  if (!element) {
    throw new Error("bannedWord text is null");
  }
  if (!(element instanceof HTMLDivElement)) {
    throw new Error("bannedWord text is not HTMLDivElement");
  }
  return element;
}

async function initCheckbox(
  id: string,
  option: OptionInterface<boolean>,
): Promise<void> {
  const checkbox = document.getElementById(id);
  if (!(checkbox instanceof HTMLInputElement)) {
    throw new Error(`${id} is not HTMLInputElement`);
  }

  const value = await option.load();
  Logger.log(`${id} is `, value);
  checkbox.checked = value;

  checkbox.addEventListener("click", async () => {
    await option.save(checkbox.checked);
  });
}

async function initSelect(
  id: string,
  option: OptionInterface<string>,
): Promise<void> {
  const select = document.getElementById(id);
  if (!(select instanceof HTMLSelectElement)) {
    throw new Error(`${id} is not HTMLSelectElement`);
  }

  const value = await option.load();
  Logger.log(`${id} is `, value);
  select.value = value;

  select.addEventListener("change", async () => {
    await option.save(select.value);
  });
}

let bannedWords: BannedWords;
let regexpList: RegExpList;

async function showLists(): Promise<void> {
  const sites = await BlockedSitesRepository.load();

  // Add after clear.
  softBlockList.innerHTML = "";
  hardBlockList.innerHTML = "";

  const softTable = document.createElement("table");
  const hardTable = document.createElement("table");
  for (const site of sites) {
    const option = new BlockedSiteOption(site);

    if (option.getState() === "soft") {
      softTable.appendChild(option.getElement());
    } else {
      hardTable.appendChild(option.getElement());
    }
  }

  softBlockList.appendChild(softTable);
  hardBlockList.appendChild(hardTable);
}

async function clear(): Promise<void> {
  if (confirm(chrome.i18n.getMessage("clearConfirm"))) {
    await BlockedSitesRepository.clear();
    await BannedWordRepository.clear();
    await RegExpRepository.clear();

    alert(chrome.i18n.getMessage("clearDone"));

    // clear all.
    softBlockList.innerHTML = "";
    hardBlockList.innerHTML = "";
    bannedWords.clear();
    regexpList.clear();
  }
}

// bind event.
clearButton.addEventListener("click", clear);

document.addEventListener("DOMContentLoaded", async (_) => {
  await showLists();

  regexpList = new RegExpList();
  await regexpList.load();

  bannedWords = new BannedWords();
  await bannedWords.load();

  await initCheckbox("developerMode", DeveloperMode);

  await initCheckbox(
    "displayTemporarilyUnblockAll",
    DisplayTemporarilyUnblockAll,
  );

  await initCheckbox("showBlockedByWordInfo", ShowBlockedByWordInfo);

  await initCheckbox("autoBlockIDN", AutoBlockIDN);

  await initSelect("defaultBlockType", DefaultBlockType);

  await initSelect("menuPosition", MenuPosition);

  await initCheckbox("blockGoogleNewsTab", BlockGoogleNewsTab);

  await initCheckbox("blockGoogleImagesTab", BlockGoogleImagesTab);

  await initCheckbox("blockGoogleSearchMovie", BlockGoogleSearchMovie);
});

localizeHtmlPage();

document
  .getElementById("exportButton")!
  .addEventListener("click", exportClicked);
document
  .getElementById("importButton")!
  .addEventListener("click", importClicked);
