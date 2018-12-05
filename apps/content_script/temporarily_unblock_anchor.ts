class TemporarilyUnblockAnchor {
    private static message(reason: string) {
        return chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(reason)]);
    }

    private readonly anchor: HTMLAnchorElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator, div: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = $.anchor();
        $.onclick(anchor, this.mediator.temporarilyUnblock.bind(this.mediator));

        div.appendChild(anchor);

        this.anchor = anchor;
    }

    public show(reason: string) {
        $.show(this.anchor);
        $.text(this.anchor, TemporarilyUnblockAnchor.message(reason));
    }

    public hide() {
        $.hide(this.anchor);
    }
}
