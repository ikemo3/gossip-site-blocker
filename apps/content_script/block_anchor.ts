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
