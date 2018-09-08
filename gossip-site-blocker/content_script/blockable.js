const BlockTargetFactory = {
    async init() {
        let count = 0;
        const blockedSites = await BlockedSitesRepository.load();
        const bannedWords = await BannedWordRepository.load();
        document.querySelectorAll(".g").forEach(async function (g1) {
            const g = new GoogleElement(g1);
            if (!g.canBlock()) {
                return;
            }
            /**
             * @type {BlockedSite|undefined}
             */
            const blockedSite = blockedSites.matches(g.getUrl());
            const banned = bannedWords.find((bannedWord) => {
                const keyword = bannedWord.keyword;
                return g.contains(keyword);
            });
            /**
             * @type {"none"|"soft"|"hard"}
             */
            let state;
            if (blockedSite) {
                state = blockedSite.getState();
            }
            else if (banned) {
                state = "soft";
            }
            else {
                state = "none";
            }
            const reason = blockedSite ? blockedSite.url : (banned ? banned.keyword : null);
            if (state === "hard") {
                g.deleteElement();
                return;
            }
            const id = `block${++count}`;
            const blockTarget = new BlockTarget(g.getElement(), g.getUrl(), id, state);
            const blockAnchor = new BlockAnchor(id, state, blockTarget, g.getUrl(), reason);
            // insert anchor after target.
            DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
        });
        document.querySelectorAll("g-inner-card").forEach(async function (g1) {
            const g = new GoogleInnerCard(g1);
            if (!g.canBlock()) {
                return;
            }
            /**
             * @type {BlockedSite|undefined}
             */
            const blockedSite = blockedSites.matches(g.getUrl());
            const banned = bannedWords.find((bannedWord) => {
                const keyword = bannedWord.keyword;
                return g.contains(keyword);
            });
            /**
             * @type {"none"|"soft"|"hard"}
             */
            let state;
            if (blockedSite) {
                state = blockedSite.getState();
            }
            else if (banned) {
                state = "soft";
            }
            else {
                state = "none";
            }
            const reason = blockedSite ? blockedSite.url : (banned ? banned.keyword : undefined);
            if (state === "hard") {
                g.deleteElement();
                return;
            }
            const id = `block${++count}`;
            const blockTarget = new BlockTarget(g.getElement(), g.getUrl(), id, state);
            const blockAnchor = new BlockAnchor(id, state, blockTarget, g.getUrl(), reason);
            blockAnchor.setWrappable("205px");
            // insert anchor after target.
            DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
        });
        return this;
    },
};
class GoogleInnerCard {
    constructor(element) {
        const anchorList = element.getElementsByTagName("a");
        const urlList = [];
        for (const anchor of anchorList) {
            const href = anchor.getAttribute("href");
            if (href === null) {
                continue;
            }
            urlList.push(href);
        }
        // ignore if no anchor.
        if (urlList.length === 0) {
            this.valid = false;
            return;
        }
        const heading = element.querySelector("[role=heading]");
        if (heading) {
            this.title = heading.textContent;
        }
        this.valid = true;
        this.url = urlList[0];
        this.element = element;
    }
    canBlock() {
        return this.valid;
    }
    getUrl() {
        return this.url;
    }
    getElement() {
        return this.element;
    }
    deleteElement() {
        this.element.parentElement.removeChild(this.element);
    }
    contains(keyword) {
        return this.title && this.title.includes(keyword);
    }
}
class GoogleElement {
    constructor(element) {
        const classList = element.classList;
        // ignore if any element has class=g
        let parent = element.parentElement;
        while (true) {
            // when root element
            if (parent === null) {
                break;
            }
            if (parent.classList.contains("g")) {
                this.valid = false;
                return;
            }
            parent = parent.parentElement;
        }
        // ignore right pane
        if (classList.contains("rhsvw")) {
            this.valid = false;
            return;
        }
        const anchorList = element.getElementsByTagName("a");
        const urlList = [];
        for (const anchor of anchorList) {
            const href = anchor.getAttribute("href");
            if (href === null) {
                continue;
            }
            // menu, etc...
            if (href === "#") {
                continue;
            }
            // ignore cache link.
            if (href.startsWith("https://webcache.googleusercontent.com")) {
                continue;
            }
            if (href.startsWith("http://webcache.googleusercontent.com")) {
                continue;
            }
            // ignore related link.
            if (href.startsWith("/search?")) {
                continue;
            }
            urlList.push(href);
        }
        // ignore if no anchor.
        if (urlList.length === 0) {
            this.valid = false;
            return;
        }
        const title = element.querySelector("h3 a").textContent;
        const contents = element.querySelector(".st").textContent;
        this.valid = true;
        this.url = urlList[0];
        this.element = element;
        this.title = title;
        this.contents = contents;
    }
    canBlock() {
        return this.valid;
    }
    contains(keyword) {
        if (this.title && this.title.includes(keyword)) {
            return true;
        }
        return this.contents && this.contents.includes(keyword);
    }
    getUrl() {
        return this.url;
    }
    getElement() {
        return this.element;
    }
    deleteElement() {
        this.element.parentElement.removeChild(this.element);
    }
}
/**
 * Block target element.
 *
 * @property element {Element}
 * @property id {string}
 */
class BlockTarget {
    /**
     *
     * @param element {Element} block target element
     * @param url {string}
     * @param id {string}
     * @param state {"none"|"soft"|"hard"}
     */
    constructor(element, url, id, state) {
        this.element = element;
        this.setUrl(url);
        // set id.
        this.id = id;
        this.element.setAttribute("id", id);
        this.setState(state);
    }
    getDOMElement() {
        return this.element;
    }
    /**
     * @private
     * @param url {string}
     */
    setUrl(url) {
        this.element.setAttribute("data-blocker-url", url);
    }
    /**
     * @returns {string}
     */
    getUrl() {
        return this.element.getAttribute("data-blocker-url");
    }
    /**
     *
     * @param state {"none"|"soft"|"hard"}
     */
    setState(state) {
        this.element.setAttribute("data-blocker-state", state);
        switch (state) {
            case "hard":
                // When it is hard it should not reach here.
                console.error("Program Error, state=hard");
                break;
            case "soft":
                this.hide();
                break;
            default:
                this.show();
                break;
        }
    }
    block(url) {
        this.setUrl(url);
        this.hide();
    }
    show() {
        this.element.removeAttribute("data-blocker-display");
    }
    hide() {
        this.element.setAttribute("data-blocker-display", "none");
    }
    unhide() {
        this.element.setAttribute("data-blocker-display", "unhide");
    }
}
//# sourceMappingURL=blockable.js.map