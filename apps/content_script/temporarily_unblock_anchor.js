class TemporarilyUnblockAnchor {
    constructor(mediator) {
        this.mediator = mediator;
        const anchor = $.anchor();
        anchor.classList.add("blocker-temporarily-unblock");
        $.onclick(anchor, this.mediator.temporarilyUnblock.bind(this.mediator));
        this.anchor = anchor;
    }
    getElement() {
        return this.anchor;
    }
    show(reason) {
        $.show(this.anchor);
        $.text(this.anchor, TemporarilyUnblockAnchor.message(reason));
    }
    hide() {
        $.hide(this.anchor);
    }
    static message(reason) {
        return chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(reason)]);
    }
}
//# sourceMappingURL=temporarily_unblock_anchor.js.map