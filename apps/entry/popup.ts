import { $ } from "../common";
import BlockedSitesRepository from "../storage/blocked_sites";
import BlockDialog from "../content_script/dialog";
import { IBasicBlockMediator } from "../content_script/mediator";
import localizeHtmlPage from "../page/option/l10n";
import DocumentURL from "../values/document_url";
import { DefaultBlockType } from "../storage/options";

function getCurrentTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        reject();
        return;
      }

      const currentTab = tabs[0];
      resolve(currentTab);
    });
  });
}

const exceptIkagadesitakaDiv = document.getElementById(
  "exceptIkagadesitakaDiv",
) as HTMLDivElement;
const exceptIkagadesitakaButton = document.getElementById(
  "exceptIkagadesitakaButton",
) as HTMLButtonElement;
const searchInEnglishDiv = document.getElementById(
  "searchInEnglishDiv",
) as HTMLDivElement;
const searchInEnglishButton = document.getElementById(
  "searchInEnglishButton",
) as HTMLButtonElement;
const optionLink = document.getElementById("optionLink") as HTMLAnchorElement;

searchInEnglishButton.addEventListener("click", async () => {
  const currentTab = await getCurrentTab();
  const { url } = currentTab;

  if (!url) {
    return;
  }

  const documentUrl = new DocumentURL(url);
  chrome.tabs.update(currentTab.id!, {
    url: documentUrl.buildSearchInEnglishURL(),
  });
});

exceptIkagadesitakaButton.addEventListener("click", async () => {
  const currentTab = await getCurrentTab();
  const url = new URL(currentTab.url!);
  const q = url.searchParams.get("q");
  const ikagadesuka = "\u3044\u304B\u304C\u3067\u3057\u305F\u304B";
  url.searchParams.set("q", `${q} -${ikagadesuka}`);

  chrome.tabs.update(currentTab.id!, { url: url.toString() });
});

optionLink.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

class PopupMediator implements IBasicBlockMediator {
  async blockPage(
    isUrl: boolean,
    url: string,
    blockType: string,
  ): Promise<void> {
    await BlockedSitesRepository.add(url, blockType);
  }
}

(async (): Promise<void> => {
  localizeHtmlPage();

  const defaultBlockType: string = await DefaultBlockType.load();

  const currentTab = await getCurrentTab();
  const { url } = currentTab;
  if (url === undefined) {
    return;
  }

  const isGoogleSearch = await $.isGoogleSearch(url);

  const lang = chrome.i18n.getUILanguage();

  if (isGoogleSearch) {
    if (lang.startsWith("ja")) {
      exceptIkagadesitakaDiv.style.display = "block";
      searchInEnglishDiv.style.display = "block";
    } else {
      exceptIkagadesitakaDiv.style.display = "none";
      searchInEnglishDiv.style.display = "block";
    }
  } else {
    exceptIkagadesitakaDiv.style.display = "none";
    searchInEnglishDiv.style.display = "none";

    const mediator = new PopupMediator();
    const _ = new BlockDialog(mediator, url, defaultBlockType);

    // hide cancel button.
    const cancelButton = document.getElementById("blocker-cancel-button");
    if (cancelButton) {
      cancelButton.style.display = "none";
    }
  }
})();
