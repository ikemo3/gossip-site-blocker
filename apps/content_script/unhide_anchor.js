class UnhideAnchor {
    static message(reason) {
        return chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(reason)]);
    }
    constructor(mediator, div, targetId) {
        this.mediator = mediator;
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.setAttribute("data-blocker-target-id", targetId);
        anchor.addEventListener("click", this.mediator.unhide.bind(this.mediator));
        div.appendChild(anchor);
        this.anchor = anchor;
    }
    none() {
        this.anchor.style.display = "none";
    }
    hide(reason) {
        this.anchor.style.display = "inline";
        this.anchor.textContent = UnhideAnchor.message(reason);
    }
    unhide() {
        this.anchor.style.display = "none";
    }
    block(reason) {
        this.anchor.style.display = "inline";
        this.anchor.textContent = UnhideAnchor.message(reason);
    }
}
//# sourceMappingURL=unhide_anchor.js.map