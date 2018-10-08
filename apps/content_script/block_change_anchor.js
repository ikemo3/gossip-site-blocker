class BlockChangeAnchor {
    constructor(parent, url, reason) {
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.textContent = "change state";
        anchor.addEventListener("click", this.onclick.bind(this));
        parent.appendChild(anchor);
        this.anchor = anchor;
        this.url = url;
        this.reason = reason;
    }
    changeState(state) {
        switch (state) {
            case "unhide":
                this.anchor.style.display = "inline";
                break;
            default:
                this.anchor.style.display = "none";
                break;
        }
    }
    none() {
        this.anchor.style.display = "none";
    }
    hide() {
        this.anchor.style.display = "none";
    }
    unhide() {
        this.anchor.style.display = "inline";
    }
    block() {
        this.anchor.style.display = "none";
    }
    onclick() {
        const dialog = new BlockChangeAnchorDialog(this.url, this.reason);
    }
}
//# sourceMappingURL=block_change_anchor.js.map