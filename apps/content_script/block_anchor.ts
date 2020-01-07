/* global $ */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class BlockAnchor {
    private readonly anchor: HTMLAnchorElement;

    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor($.message('blockThisPage'));
        $.onclick(anchor, this.mediator.showBlockDialog.bind(this.mediator));

        this.anchor = anchor;
    }

    public getElement(): Element {
        return this.anchor;
    }

    public showBlockThisPage(): void {
        $.showBlock(this.anchor);
        $.text(this.anchor, $.message('blockThisPage'));
    }

    public showBlockExplicitly(): void {
        $.showBlock(this.anchor);
        $.text(this.anchor, $.message('blockThisPageExplicitly'));
    }

    public hide(): void {
        $.hide(this.anchor);
    }
}
