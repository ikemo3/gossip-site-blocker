class HideAnchor {
    constructor(mediator) {
        this.mediator = mediator;
        const anchor = $.anchor($.message("hideThisPage"));
        $.onclick(anchor, this.mediator.hide.bind(this.mediator));
        this.anchor = anchor;
    }
    getElement() {
        return this.anchor;
    }
    show() {
        $.show(this.anchor);
    }
    hide() {
        $.hide(this.anchor);
    }
}
//# sourceMappingURL=hide_anchor.js.map