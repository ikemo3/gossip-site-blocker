class TemporarilyUnblockAnchor {
    private readonly anchor: HTMLAnchorElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor();
        anchor.classList.add("blocker-temporarily-unblock");
        $.onclick(anchor, this.mediator.temporarilyUnblock.bind(this.mediator));

        this.anchor = anchor;
    }

    public getElement(): Element {
        return this.anchor;
    }

    public show(reason: string) {
        $.show(this.anchor);
        $.text(this.anchor, TemporarilyUnblockAnchor.message(reason));
    }

    public hide() {
        $.hide(this.anchor);
    }

    private static message(reason: string) {
        return chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(reason)]);
    }
}
