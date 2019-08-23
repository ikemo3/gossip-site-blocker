class GoogleElement {
    constructor(element) {
        const classList = element.classList;
        // ignore if image.
        if (element.matches("#imagebox_bigimages")) {
            this.valid = false;
            this.ignoreExplicitly = true;
            return;
        }
        // ignore if dictionary.
        if (element.querySelector("#dictionary-modules") !== null) {
            this.valid = false;
            this.ignoreExplicitly = true;
            return;
        }
        // ignore if any element has class=g
        let parent = element.parentElement;
        while (true) {
            // when root element
            if (parent === null) {
                break;
            }
            if (parent.classList.contains("g")) {
                this.valid = false;
                this.ignoreExplicitly = true;
                return;
            }
            parent = parent.parentElement;
        }
        // ignore right pane
        if (classList.contains("rhsvw")) {
            this.valid = false;
            this.ignoreExplicitly = true;
            return;
        }
        const anchorList = element.getElementsByTagName("a");
        const urlList = [];
        for (const anchor of anchorList) {
            const ping = anchor.getAttribute("ping");
            const href = anchor.getAttribute("href");
            const onmouseDown = anchor.getAttribute("onmousedown");
            if (href === null) {
                continue;
            }
            if (!href.startsWith("https://books.google") && ping === null && onmouseDown == null) {
                continue;
            }
            if (href.startsWith("https://webcache.googleusercontent.com/")) {
                continue;
            }
            // firefox, coccoc, ...
            if (href.startsWith("/url?")) {
                const matchData = href.match("&url=(.*)&");
                if (matchData !== null) {
                    urlList.push(matchData[0]);
                }
            }
            else {
                urlList.push(href);
            }
        }
        // ignore if no anchor.
        if (urlList.length === 0) {
            this.valid = false;
            this.ignoreExplicitly = false;
            return;
        }
        const h3 = element.querySelector("h3");
        // ignore if no h3(ex. Google Translate)
        if (h3 === null) {
            this.valid = false;
            this.ignoreExplicitly = true;
            return;
        }
        const title = h3.textContent ? h3.textContent : "";
        const st = element.querySelector(".st");
        const contents = st ? st.textContent : "";
        this.valid = true;
        this.ignoreExplicitly = false;
        this.url = urlList[0];
        this.element = element;
        this.title = title;
        this.contents = contents;
        // operation insert point
        const actionMenu = this.element.querySelector(".action-menu");
        if (actionMenu !== null) {
            this.operationInsertPoint = actionMenu;
        }
        else {
            this.operationInsertPoint = element.querySelector("a");
        }
    }
    isIgnoreable() {
        return this.ignoreExplicitly;
    }
    canBlock() {
        return this.valid;
    }
    contains(keyword) {
        if (this.title.includes(keyword)) {
            return true;
        }
        return this.contents !== "" && this.contents.includes(keyword);
    }
    containsInTitle(keyword) {
        return this.title.includes(keyword);
    }
    getUrl() {
        return this.url;
    }
    getElement() {
        return this.element;
    }
    getOperationInsertPoint() {
        return this.operationInsertPoint;
    }
    deleteElement() {
        this.element.parentElement.removeChild(this.element);
    }
    getPosition() {
        return "absolute";
    }
    getCssClass() {
        return "block-google-element";
    }
}
//# sourceMappingURL=google_element.js.map