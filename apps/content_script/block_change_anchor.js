class BlockChangeAnchor {
    constructor(mediator) {
        this.mediator = mediator;
        const anchor = $.anchor($.message("changeBlockState"));
        $.onclick(anchor, this.mediator.showChangeStateDialog.bind(this.mediator));
        this.anchor = anchor;
    }
    getElement() {
        return this.anchor;
    }
    hide() {
        $.hide(this.anchor);
    }
    show() {
        $.showBlock(this.anchor);
    }
}
//# sourceMappingURL=block_change_anchor.js.map