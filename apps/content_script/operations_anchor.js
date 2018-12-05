class OperationsAnchor {
    constructor(hideAnchor, blockAnchor, changeAnchor, position) {
        this.operationSpan = $.span("", "block-anchor");
        this.hideAnchor = hideAnchor;
        this.blockAnchor = blockAnchor;
        this.changeAnchor = changeAnchor;
        // add icon
        this.iconAnchor = $.anchor("");
        this.iconAnchor.style.position = "relative";
        const iconUrl = chrome.runtime.getURL("icons/icon-16.png");
        const iconImg = document.createElement("img");
        iconImg.src = iconUrl;
        this.operationSpan.appendChild(this.iconAnchor);
        this.iconAnchor.appendChild(iconImg);
        $.onclick(this.iconAnchor, this.showOperations.bind(this));
        const div = $.div("block-operations-div");
        div.style.position = position;
        div.appendChild(this.hideAnchor.getElement());
        div.appendChild(this.blockAnchor.getElement());
        div.appendChild(this.changeAnchor.getElement());
        this.div = div;
        this.isShow = false;
    }
    getElement() {
        return this.operationSpan;
    }
    showOperations() {
        this.isShow = !this.isShow;
        if (this.isShow) {
            this.iconAnchor.appendChild(this.div);
        }
        else {
            this.iconAnchor.removeChild(this.div);
        }
    }
}
//# sourceMappingURL=operations_anchor.js.map