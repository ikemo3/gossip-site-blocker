class TemporarilyUnblockAnchor {
    static message(reason) {
        return chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(reason)]);
    }
    constructor(mediator, div) {
        this.mediator = mediator;
        const anchor = $.anchor();
        $.onclick(anchor, this.mediator.temporarilyUnblock.bind(this.mediator));
        div.appendChild(anchor);
        this.anchor = anchor;
    }
    show(reason) {
        $.show(this.anchor);
        $.text(this.anchor, TemporarilyUnblockAnchor.message(reason));
    }
    hide() {
        $.hide(this.anchor);
    }
}
//# sourceMappingURL=temporarily_unblock_anchor.js.map