class HideAnchor {
    private readonly anchor: HTMLAnchorElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator, div: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = $.anchor($.message("hideThisPage"));
        $.onclick(anchor, this.mediator.hide.bind(this.mediator));

        div.appendChild(anchor);

        this.anchor = anchor;
    }

    public show() {
        $.show(this.anchor);
    }

    public hide() {
        $.hide(this.anchor);
    }
}
