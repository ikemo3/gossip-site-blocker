class BlockChangeAnchor {
    private readonly mediator: BlockMediator;
    private readonly anchor: HTMLAnchorElement;

    constructor(mediator: BlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor($.message("changeBlockState"));
        $.onclick(anchor, this.mediator.showChangeStateDialog.bind(this.mediator));

        this.anchor = anchor;
    }

    public getElement(): Element {
        return this.anchor;
    }

    public hide() {
        $.hide(this.anchor);
    }

    public show() {
        $.show(this.anchor);
    }
}
