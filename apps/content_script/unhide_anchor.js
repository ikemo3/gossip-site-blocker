class UnhideAnchor {
    static message(reason) {
        return chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(reason)]);
    }
    constructor(mediator, div) {
        this.mediator = mediator;
        const anchor = $.anchor();
        $.onclick(anchor, this.mediator.unhide.bind(this.mediator));
        div.appendChild(anchor);
        this.anchor = anchor;
    }
    none() {
        $.hide(this.anchor);
    }
    hide(reason) {
        $.show(this.anchor);
        $.text(this.anchor, UnhideAnchor.message(reason));
    }
    unhide() {
        $.hide(this.anchor);
    }
    block(reason) {
        $.show(this.anchor);
        $.text(this.anchor, UnhideAnchor.message(reason));
    }
}
//# sourceMappingURL=unhide_anchor.js.map