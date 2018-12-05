class BlockAnchor {
    constructor(mediator) {
        this.mediator = mediator;
        const anchor = $.anchor($.message("blockThisPage"));
        $.onclick(anchor, this.mediator.showBlockDialog.bind(this.mediator));
        this.anchor = anchor;
    }
    getElement() {
        return this.anchor;
    }
    showBlockThisPage() {
        $.show(this.anchor);
        $.text(this.anchor, $.message("blockThisPage"));
    }
    showBlockExplicitly() {
        $.show(this.anchor);
        $.text(this.anchor, $.message("blockThisPageExplicitly"));
    }
    hide() {
        $.hide(this.anchor);
    }
}
//# sourceMappingURL=block_anchor.js.map