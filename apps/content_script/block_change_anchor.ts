/* global $ */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class BlockChangeAnchor {
    private readonly mediator: BlockMediator;

    private readonly anchor: HTMLAnchorElement;

    constructor(mediator: BlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor($.message('changeBlockState'));
        $.onclick(anchor, this.mediator.showChangeStateDialog.bind(this.mediator));

        this.anchor = anchor;
    }

    public getElement(): Element {
        return this.anchor;
    }

    public hide(): void {
        $.hide(this.anchor);
    }

    public show(): void {
        $.showBlock(this.anchor);
    }
}
