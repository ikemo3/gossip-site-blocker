class BlockAnchor {
    constructor(mediator, div) {
        this.mediator = mediator;
        const anchor = $.anchor($.message("blockThisPage"));
        $.onclick(anchor, this.mediator.showBlockDialog.bind(this.mediator));
        const br = $.br();
        div.appendChild(anchor);
        div.appendChild(br);
        this.anchor = anchor;
        this.br = br;
    }
    none() {
        $.show(this.anchor);
        $.show(this.br);
        $.text(this.anchor, $.message("blockThisPage"));
    }
    unhide(blockReason) {
        if (blockReason.getType() !== BlockType.URL_EXACTLY) {
            $.show(this.anchor);
            $.show(this.br);
            $.text(this.anchor, $.message("blockThisPageExplicitly"));
        }
        else {
            $.hide(this.anchor);
            $.hide(this.br);
        }
    }
    hide() {
        $.hide(this.anchor);
        $.hide(this.br);
    }
    block() {
        $.hide(this.anchor);
        $.hide(this.br);
    }
}
//# sourceMappingURL=block_anchor.js.map