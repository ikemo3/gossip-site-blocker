class BlockChangeAnchor {
    constructor(mediator, parent) {
        this.mediator = mediator;
        const anchor = $.anchor($.message("changeBlockState"));
        $.onclick(anchor, this.mediator.showChangeStateDialog.bind(this.mediator));
        parent.appendChild(anchor);
        this.anchor = anchor;
    }
    hide() {
        $.hide(this.anchor);
    }
    show() {
        $.show(this.anchor);
    }
}
//# sourceMappingURL=block_change_anchor.js.map