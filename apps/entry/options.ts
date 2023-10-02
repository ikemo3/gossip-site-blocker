import BannedWords from "../page/option/banned_word";
import BlockedSitesRepository from "../storage/blocked_sites";
import BlockedSiteOption from "../page/option/blocked_site_option";
import { BannedWordRepository } from "../storage/banned_words";
import { RegExpRepository } from "../storage/regexp_repository";
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
import { Logger } from "../libs/logger";
import RegExpList from "../page/option/regexp";
import localizeHtmlPage from "../page/option/l10n";
import exportClicked from "../page/option/export";
import importClicked from "../page/option/import";

const softBlockList = document.getElementById("softBlockList");
const hardBlockList = document.getElementById("hardBlockList");
const clearButton = document.getElementById("clearButton");

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
  if (softBlockList instanceof HTMLDivElement) {
    softBlockList.innerHTML = "";
  }

  if (hardBlockList instanceof HTMLDivElement) {
    hardBlockList.innerHTML = "";
  }

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

  softBlockList?.appendChild(softTable);
  hardBlockList?.appendChild(hardTable);
}

async function clear(): Promise<void> {
  // eslint-disable-next-line no-alert, no-restricted-globals
  if (confirm(chrome.i18n.getMessage("clearConfirm"))) {
    await BlockedSitesRepository.clear();
    await BannedWordRepository.clear();
    await RegExpRepository.clear();

    // eslint-disable-next-line no-alert
    alert(chrome.i18n.getMessage("clearDone"));

    // clear all.
    if (softBlockList instanceof HTMLDivElement) {
      softBlockList.innerHTML = "";
    }
    if (hardBlockList instanceof HTMLDivElement) {
      hardBlockList.innerHTML = "";
    }
    bannedWords.clear();
    regexpList.clear();
  }
}

// bind event.
clearButton?.addEventListener("click", clear);

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
