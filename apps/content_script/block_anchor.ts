class BlockAnchor {
    private readonly anchor: HTMLAnchorElement;
    private readonly br: HTMLBRElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator, div: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = $.anchor($.message("blockThisPage"));
        $.onclick(anchor, this.mediator.showBlockDialog.bind(this.mediator));

        const br = $.br();

        div.appendChild(anchor);
        div.appendChild(br);

        this.anchor = anchor;
        this.br = br;
    }

    public none() {
        $.show(this.anchor);
        $.show(this.br);
        $.text(this.anchor, $.message("blockThisPage"));
    }

    public unhide(blockReason: BlockReason) {
        if (blockReason.getType() !== BlockType.URL_EXACTLY) {
            $.show(this.anchor);
            $.show(this.br);
            $.text(this.anchor, $.message("blockThisPageExplicitly"));
        } else {
            $.hide(this.anchor);
            $.hide(this.br);
        }
    }

    public hide() {
        $.hide(this.anchor);
        $.hide(this.br);
    }

    public block() {
        $.hide(this.anchor);
        $.hide(this.br);
    }
}
