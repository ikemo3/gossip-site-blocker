function getCurrentTab(): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}, ((tabs) => {
            if (tabs.length === 0) {
                reject();
                return;
            }

            const currentTab = tabs[0];
            resolve(currentTab);
        }));
    });
}

const exceptIkagadesitakaDiv = document.getElementById("exceptIkagadesitakaDiv") as HTMLDivElement;
const exceptIkagadesitakaButton = document.getElementById("exceptIkagadesitakaButton") as HTMLButtonElement;
const searchInEnglishDiv = document.getElementById("searchInEnglishDiv") as HTMLDivElement;
const searchInEnglishButton = document.getElementById("searchInEnglishButton") as HTMLButtonElement;

searchInEnglishButton.addEventListener("click", async () => {
    const currentTab = await getCurrentTab();
    const url = currentTab.url;

    chrome.tabs.update(currentTab.id!, {url: url + "&gl=us&hl=en"});
});

exceptIkagadesitakaButton.addEventListener("click", async () => {
    const currentTab = await getCurrentTab();
    const url = new URL(currentTab.url!);
    const q = url.searchParams.get("q");
    const ikagadesuka = "\u3044\u304B\u304C\u3067\u3057\u305F\u304B";
    url.searchParams.set("q", q + " -" + ikagadesuka);

    chrome.tabs.update(currentTab.id!, {url: url.toString()});
});

(async () => {
    const lang = chrome.i18n.getUILanguage();

    if (lang === "ja") {
        exceptIkagadesitakaDiv.style.display = "block";
        searchInEnglishDiv.style.display = "block";
    } else {
        exceptIkagadesitakaDiv.style.display = "none";
        searchInEnglishDiv.style.display = "block";
    }
})();
