class BlockChangeAnchor {
    private readonly mediator: BlockMediator;
    private readonly anchor: HTMLAnchorElement;

    constructor(mediator: BlockMediator, parent: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = $.anchor($.message("changeBlockState"));
        $.onclick(anchor, this.mediator.showChangeStateDialog.bind(this));

        parent.appendChild(anchor);

        this.anchor = anchor;
    }

    public changeState(state: string) {
        switch (state) {
            case "unhide":
                $.show(this.anchor);
                break;
            default:
                $.hide(this.anchor);
                break;
        }
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
