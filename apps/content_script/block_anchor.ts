class BlockAnchor {
    private readonly anchor: HTMLAnchorElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor($.message("blockThisPage"));
        $.onclick(anchor, this.mediator.showBlockDialog.bind(this.mediator));

        this.anchor = anchor;
    }

    public getElement(): Element {
        return this.anchor;
    }

    public showBlockThisPage() {
        $.show(this.anchor);
        $.text(this.anchor, $.message("blockThisPage"));
    }

    public showBlockExplicitly() {
        $.show(this.anchor);
        $.text(this.anchor, $.message("blockThisPageExplicitly"));
    }

    public hide() {
        $.hide(this.anchor);
    }
}
