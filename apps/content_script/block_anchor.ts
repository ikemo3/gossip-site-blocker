class BlockAnchor {
    private readonly anchor: HTMLAnchorElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator, div: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = $.anchor($.message("blockThisPage"));
        $.onclick(anchor, this.mediator.showBlockDialog.bind(this.mediator));

        div.appendChild(anchor);

        this.anchor = anchor;
    }

    public none() {
        $.show(this.anchor);
        $.text(this.anchor, $.message("blockThisPage"));
    }

    public unhide(blockReason: BlockReason) {
        if (blockReason.getType() !== BlockType.URL_EXACTLY) {
            $.show(this.anchor);
            $.text(this.anchor, $.message("blockThisPageExplicitly"));
        } else {
            $.hide(this.anchor);
        }
    }

    public hide() {
        $.hide(this.anchor);
    }

    public block() {
        $.hide(this.anchor);
    }
}
