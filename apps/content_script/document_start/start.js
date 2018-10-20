let options = null;
// add observer
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
                if (node.classList.contains("g")) {
                    if (options !== null) {
                        tryBlockGoogleElement(node, options);
                    }
                    else {
                        pendingsGoogle.push(node);
                    }
                }
                else if (node.nodeName.toLowerCase() === "g-inner-card") {
                    if (options !== null) {
                        tryBlockGoogleInnerCard(node, options);
                    }
                    else {
                        pendingsInnerCard.push(node);
                    }
                }
            }
        }
    });
});
const pendingsGoogle = [];
const pendingsInnerCard = [];
const config = { childList: true, subtree: true };
observer.observe(document.documentElement, config);
(async () => {
    const blockedSites = await BlockedSitesRepository.load();
    const bannedWords = await BannedWordRepository.load();
    const idnOption = await OptionRepository.getAutoBlockIDNOption();
    const defaultBlockType = await OptionRepository.defaultBlockType();
    Logger.debug("autoBlockIDNOption:", idnOption);
    options = { blockedSites, bannedWords, idnOption, defaultBlockType };
    for (const node of pendingsGoogle) {
        tryBlockGoogleElement(node, options);
    }
    for (const node of pendingsInnerCard) {
        tryBlockGoogleInnerCard(node, options);
    }
})();
const subObserverList = [];
function tryBlockGoogleElement(node, options) {
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
    subObserver.observe(node, { childList: true, subtree: true });
    subObserverList.push(subObserver);
}
function blockGoogleElementClosure(node, options) {
    let completed = false;
    return () => {
        if (completed === true) {
            return;
        }
        completed = blockGoogleElement(node, options);
    };
}
function tryBlockGoogleInnerCard(node, options) {
    const completed = blockGoogleInnerCard(node, options);
    if (completed) {
        return;
    }
    // if failed, add observer for retry.
    const block = blockGoogleInnerCardClosure(node, options);
    const subObserver = new MutationObserver(() => {
        block();
    });
    subObserver.observe(node, { childList: true, subtree: true });
    subObserverList.push(subObserver);
}
function blockGoogleInnerCardClosure(node, options) {
    let completed = false;
    return () => {
        if (completed === true) {
            return;
        }
        completed = blockGoogleInnerCard(node, options);
    };
}
document.addEventListener("DOMContentLoaded", () => {
    // clear sub-observer
    for (const subObserver of subObserverList) {
        subObserver.disconnect();
    }
});
//# sourceMappingURL=start.js.map