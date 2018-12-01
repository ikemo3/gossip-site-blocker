class BlockChangeAnchor {
    private readonly mediator: BlockMediator;
    private readonly anchor: HTMLAnchorElement;

    constructor(mediator: BlockMediator, parent: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = $.anchor($.message("changeBlockState"));
        $.onclick(anchor, this.mediator.showChangeStateDialog.bind(this.mediator));

        parent.appendChild(anchor);

        this.anchor = anchor;
    }

    public none() {
        $.hide(this.anchor);
    }

    public hide() {
        $.hide(this.anchor);
    }

    public unhide(blockReason: BlockReason) {
        if (blockReason.getType() === BlockType.URL_EXACTLY) {
            $.show(this.anchor);
        } else {
            $.hide(this.anchor);
        }
    }

    public block() {
        $.hide(this.anchor);
    }
}
