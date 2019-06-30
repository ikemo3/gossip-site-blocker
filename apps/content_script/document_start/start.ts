interface IOptions {
    blockedSites: BlockedSites;
    bannedWords: IBannedWord[];
    regexpList: IRegExpItem[];
    idnOption: IAutoBlockIDNOption;
    defaultBlockType: string;
    menuPosition: MenuPosition;
    bannedWordOption: IBannedWordOption;
}

let gsbOptions: IOptions | null = null;

// add observer
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
                if (node.classList.contains("g")) {
                    if (gsbOptions !== null) {
                        tryBlockGoogleElement(node, gsbOptions);
                    } else {
                        pendingsGoogle.push(node);
                    }
                } else if (node.nodeName.toLowerCase() === "g-inner-card") {
                    if (gsbOptions !== null) {
                        tryBlockGoogleInnerCard(node, gsbOptions);
                    } else {
                        pendingsInnerCard.push(node);
                    }
                } else if (node.classList.contains("dbsr")) {
                    if (gsbOptions !== null) {
                        tryBlockGoogleTopNews(node, gsbOptions);
                    } else {
                        pendingsTopNews.push(node);
                    }
                }
            }
        }
    });
});

const pendingsGoogle: Element[] = [];
const pendingsInnerCard: Element[] = [];
const pendingsTopNews: Element[] = [];
const blockReasons: BlockReason[] = [];
const config = {childList: true, subtree: true};
observer.observe(document.documentElement, config);

(async () => {
    const blockedSites: BlockedSites = await BlockedSitesRepository.load();
    const bannedWords: IBannedWord[] = await BannedWordRepository.load();
    const regexpList: IRegExpItem[] = await RegExpRepository.load();
    const idnOption = await OptionRepository.getAutoBlockIDNOption();
    const defaultBlockType: string = await OptionRepository.defaultBlockType();
    const menuPosition: MenuPosition = await OptionRepository.menuPosition();
    const bannedWordOption: IBannedWordOption = await OptionRepository.getBannedWordOption();
    Logger.debug("autoBlockIDNOption:", idnOption);

    gsbOptions = {blockedSites, bannedWords, regexpList, idnOption, defaultBlockType, menuPosition, bannedWordOption};

    for (const node of pendingsGoogle) {
        tryBlockGoogleElement(node, gsbOptions);
    }

    for (const node of pendingsInnerCard) {
        tryBlockGoogleInnerCard(node, gsbOptions);
    }

    for (const node of pendingsTopNews) {
        tryBlockGoogleTopNews(node, gsbOptions);
    }
})();

const subObserverList: MutationObserver[] = [];

function tryBlockGoogleElement(node: Element, options: IOptions) {
    // first, try block.
    const completed = blockGoogleElement(node, options);
    if (completed) {
        return;
    }

    // if failed, add observer for retry.
    const block = blockGoogleElementClosure(node, options);
    const subObserver = new MutationObserver(() => {
        block();
    });

    subObserver.observe(node, {childList: true, subtree: true});
    subObserverList.push(subObserver);
}

function blockGoogleElementClosure(node: Element, options: IOptions) {
    let completed: boolean = false;
    return () => {
        if (completed) {
            return;
        }

        completed = blockGoogleElement(node, options);
    };
}

function tryBlockGoogleInnerCard(node: Element, options: IOptions) {
    const completed = blockGoogleInnerCard(node, options);
    if (completed) {
        return;
    }

    // if failed, add observer for retry.
    const block = blockGoogleInnerCardClosure(node, options);
    const subObserver = new MutationObserver(() => {
        block();
    });

    subObserver.observe(node, {childList: true, subtree: true});
    subObserverList.push(subObserver);
}

function blockGoogleInnerCardClosure(node: Element, options: IOptions) {
    let completed: boolean = false;
    return () => {
        if (completed) {
            return;
        }

        completed = blockGoogleInnerCard(node, options);
    };
}

function tryBlockGoogleTopNews(node: Element, options: IOptions) {
    const completed = blockGoogleTopNews(node, options);
    if (completed) {
        return;
    }

    // if failed, add observer for retry.
    const block = blockGoogleTopNewsClosure(node, options);
    const subObserver = new MutationObserver(() => {
        block();
    });

    subObserver.observe(node, {childList: true, subtree: true});
    subObserverList.push(subObserver);
}

function blockGoogleTopNewsClosure(node: Element, options: IOptions) {
    let completed: boolean = false;
    return () => {
        if (completed) {
            return;
        }

        completed = blockGoogleTopNews(node, options);
    };
}

document.addEventListener("DOMContentLoaded", () => {
    // clear sub-observer
    for (const subObserver of subObserverList) {
        subObserver.disconnect();
    }
});
