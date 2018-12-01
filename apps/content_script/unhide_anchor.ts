class UnhideAnchor {
    private static message(reason: string) {
        return chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(reason)]);
    }

    private readonly anchor: HTMLAnchorElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator, div: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = $.anchor();
        $.onclick(anchor, this.mediator.unhide.bind(this.mediator));

        div.appendChild(anchor);

        this.anchor = anchor;
    }

    public none() {
        $.hide(this.anchor);
    }

    public hide(reason: string) {
        $.show(this.anchor);
        $.text(this.anchor, UnhideAnchor.message(reason));
    }

    public unhide() {
        $.hide(this.anchor);
    }

    public block(reason: string) {
        $.show(this.anchor);
        $.text(this.anchor, UnhideAnchor.message(reason));
    }
}
