const BlockTargetFactory = {
    async init() {
        let count = 0;
        const blockedSites = await BlockedSitesRepository.load();
        document.querySelectorAll(".g").forEach(async function (g1) {
            const g = new GoogleElement(g1);
            if (!g.canBlock()) {
                return;
            }
            /**
             * @type {BlockedSite|undefined}
             */
            const blockedSite = blockedSites.matches(g.getUrl());
            /**
             * @type {"none"|"soft"|"hard"}
             */
            const state = (blockedSite ? blockedSite.getState() : "none");
            /**
             * URL of block or unhide
             * @type {string}
             */
            const targetUrl = (blockedSite ? blockedSite.url : g.getUrl());
            if (state === "hard") {
                g.deleteElement();
                return;
            }
            const id = `block${++count}`;
            const blockTarget = new BlockTarget(g.getElement(), g.getUrl(), id, state);
            const blockAnchor = new BlockAnchor(id, state, blockTarget, targetUrl);
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
            /**
             * @type {"none"|"soft"|"hard"}
             */
            const state = (blockedSite ? blockedSite.getState() : "none");
            /**
             * URL of block or unhide
             * @type {string}
             */
            const targetUrl = (blockedSite ? blockedSite.url : g.getUrl());
            if (state === "hard") {
                g.deleteElement();
                return;
            }
            const id = `block${++count}`;
            const blockTarget = new BlockTarget(g.getElement(), g.getUrl(), id, state);
            const blockAnchor = new BlockAnchor(id, state, blockTarget, targetUrl);
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
/**
 * @property element Div element wrapping the anchor
 * @property anchor Anchor element
 * @property state blocked state
 * @property url URL to block
 */
class BlockAnchor {
    /**
     *
     * @param {string} targetId target element's id
     * @param {"none"|"soft"|"hard"} state
     * @param {BlockTarget} targetObject
     * @param {string} url URL to block
     */
    constructor(targetId, state, targetObject, url) {
        const div = document.createElement("div");
        div.classList.add("block-anchor");
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.setAttribute("data-blocker-target-id", targetId);
        div.appendChild(anchor);
        this.element = div;
        this.anchor = anchor;
        this.state = state;
        this.targetObject = targetObject;
        this.handler = null;
        this.setUrl(url);
        this.setText();
        this.setHandler();
    }
    getDOMElement() {
        return this.element;
    }
    setWrappable(width) {
        this.element.style.width = width;
        this.element.style.whiteSpace = "normal";
    }
    setState(newState) {
        this.state = newState;
        this.anchor.setAttribute("data-blocker-state", newState);
        this.setHandler();
        this.setText();
    }
    setHandler() {
        if (this.handler) {
            this.anchor.removeEventListener("click", this.handler);
            this.handler = null;
        }
        switch (this.state) {
            case "none":
                // set handler to block.
                this.handler = this.showBlockDialog.bind(this);
                break;
            case "soft":
                // set handler to unhide.
                this.handler = this.unhide.bind(this);
                break;
            case "hard":
                // do nothing.
                break;
            case "unhide":
                // set handler to hide.
                this.handler = this.hide.bind(this);
                break;
        }
        if (this.handler) {
            this.anchor.addEventListener("click", this.handler);
        }
    }
    setText() {
        switch (this.state) {
            case "none":
                this.anchor.textContent = chrome.i18n.getMessage("blockThisPage");
                break;
            case "soft":
                this.anchor.textContent = chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(this.url)]);
                break;
            case "hard":
                this.anchor.textContent = "";
                break;
            case "unhide":
                this.anchor.textContent = chrome.i18n.getMessage("unhideThisPage");
                break;
        }
    }
    setUrl(url) {
        this.url = url;
        this.setText();
    }
    showBlockDialog(ignore) {
        // show dialog.
        new BlockDialog(this, this.url);
    }
    /**
     * @param {string} url
     * @param {string} blockType
     */
    blockPage(url, blockType) {
        // hide element.
        this.targetObject.block(url);
        this.setState(blockType);
        // add URL to block.
        BlockedSitesRepository.add(url, blockType);
        this.setUrl(url);
    }
    /**
     * @param ignore
     */
    unhide(ignore) {
        // show block temporarily.
        this.targetObject.unhide();
        this.setState("unhide");
    }
    /**
     * @param ignore
     */
    hide(ignore) {
        this.targetObject.hide();
        this.setState("soft");
    }
}
//# sourceMappingURL=blockable.js.map