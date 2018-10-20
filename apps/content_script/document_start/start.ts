interface IOptions {
    blockedSites: BlockedSites;
    bannedWords: IBannedWord[];
    idnOption: IAutoBlockIDNOption;
    defaultBlockType: string;
}

let options: IOptions | null = null;

// add observer
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
                if (node.classList.contains("g")) {
                    if (options !== null) {
                        blockGoogleElement(node, options);
                    } else {
                        pendingsGoogle.push(node);
                    }
                } else if (node.nodeName.toLowerCase() === "g-inner-card") {
                    if (options !== null) {
                        blockGoogleInnerCard(node, options);
                    } else {
                        pendingsInnerCard.push(node);
                    }
                }
            }
        }
    });
});

const pendingsGoogle: Element[] = [];
const pendingsInnerCard: Element[] = [];
const config = {childList: true, subtree: true};
observer.observe(document.documentElement, config);

(async () => {
    const blockedSites: BlockedSites = await BlockedSitesRepository.load();
    const bannedWords: IBannedWord[] = await BannedWordRepository.load();
    const idnOption = await OptionRepository.getAutoBlockIDNOption();
    const defaultBlockType: string = await OptionRepository.defaultBlockType();
    Logger.debug("autoBlockIDNOption:", idnOption);

    options = {blockedSites, bannedWords, idnOption, defaultBlockType};

    for (const node of pendingsGoogle) {
        blockGoogleElement(node, options);
    }

    for (const node of pendingsInnerCard) {
        blockGoogleInnerCard(node, options);
    }
})();
