class HideAnchor {
    constructor(mediator, div, targetId) {
        this.mediator = mediator;
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.setAttribute("data-blocker-target-id", targetId);
        anchor.textContent = chrome.i18n.getMessage("hideThisPage");
        anchor.addEventListener("click", this.mediator.hide.bind(this.mediator));
        div.appendChild(anchor);
        this.anchor = anchor;
    }
    none() {
        this.anchor.style.display = "none";
    }
    unhide() {
        this.anchor.style.display = "inline";
    }
    hide() {
        this.anchor.style.display = "none";
    }
    block() {
        this.anchor.style.display = "none";
    }
}
//# sourceMappingURL=hide_anchor.js.map