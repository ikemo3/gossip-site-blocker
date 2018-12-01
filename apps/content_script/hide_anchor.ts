class HideAnchor {
    private readonly anchor: HTMLAnchorElement;
    private readonly br: HTMLBRElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator, div: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = $.anchor($.message("hideThisPage"));
        $.onclick(anchor, this.mediator.hide.bind(this.mediator));

        const br = $.br();

        div.appendChild(anchor);
        div.appendChild(br);

        this.anchor = anchor;
        this.br = br;
    }

    public none() {
        $.hide(this.anchor);
        $.hide(this.br);
    }

    public unhide() {
        $.show(this.anchor);
        $.show(this.br);
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
