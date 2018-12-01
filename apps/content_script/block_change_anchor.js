class BlockChangeAnchor {
    constructor(mediator, parent) {
        this.mediator = mediator;
        const anchor = $.anchor($.message("changeBlockState"));
        $.onclick(anchor, this.mediator.showChangeStateDialog.bind(this.mediator));
        parent.appendChild(anchor);
        this.anchor = anchor;
    }
    none() {
        $.hide(this.anchor);
    }
    hide() {
        $.hide(this.anchor);
    }
    unhide(blockReason) {
        if (blockReason.getType() === BlockType.URL_EXACTLY) {
            $.show(this.anchor);
        }
        else {
            $.hide(this.anchor);
        }
    }
    block() {
        $.hide(this.anchor);
    }
}
//# sourceMappingURL=block_change_anchor.js.map