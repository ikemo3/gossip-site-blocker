class BlockAnchor {
    constructor(mediator, div) {
        this.mediator = mediator;
        const anchor = $.anchor($.message("blockThisPage"));
        $.onclick(anchor, this.mediator.showBlockDialog.bind(this.mediator));
        div.appendChild(anchor);
        this.anchor = anchor;
    }
    none() {
        $.show(this.anchor);
        $.text(this.anchor, $.message("blockThisPage"));
    }
    unhide(blockReason) {
        if (blockReason.getType() !== BlockType.URL_EXACTLY) {
            $.show(this.anchor);
            $.text(this.anchor, $.message("blockThisPageExplicitly"));
        }
        else {
            $.hide(this.anchor);
        }
    }
    hide() {
        $.hide(this.anchor);
    }
    block() {
        $.hide(this.anchor);
    }
}
//# sourceMappingURL=block_anchor.js.map