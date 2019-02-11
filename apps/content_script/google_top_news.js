class GoogleTopNews {
    constructor(element) {
        const anchor = element.querySelector("a");
        if (anchor === null) {
            this.valid = false;
            return;
        }
        const href = anchor.href;
        if (href === "") {
            this.valid = false;
            return;
        }
        const titleDiv = anchor.querySelector(".nDgy9d");
        if (titleDiv === null) {
            this.valid = false;
            return;
        }
        this.insertPoint = anchor;
        this.valid = true;
        this.url = href;
        this.element = element;
        this.title = titleDiv.textContent !== null ? titleDiv.textContent : "";
    }
    canBlock() {
        return this.valid;
    }
    contains(keyword) {
        return this.title.includes(keyword);
    }
    containsInTitle(keyword) {
        return this.title.includes(keyword);
    }
    getElement() {
        return this.element;
    }
    deleteElement() {
        $.removeSelf(this.element);
    }
    getOperationInsertPoint() {
        return this.insertPoint;
    }
    getPosition() {
        return "relative";
    }
    getUrl() {
        return this.url;
    }
    getCssClass() {
        return "block-google-top-news";
    }
}
//# sourceMappingURL=google_top_news.js.map