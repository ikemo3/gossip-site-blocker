import { $ } from '../common';
import { BlockMediator } from './block_mediator';

export class HideAnchor {
    private readonly anchor: HTMLAnchorElement;

    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor($.message('hideThisPage'));
        $.onclick(anchor, this.mediator.hide.bind(this.mediator));

        this.anchor = anchor;
    }

    public getElement(): Element {
        return this.anchor;
    }

    public show(): void {
        $.showBlock(this.anchor);
    }

    public hide(): void {
        $.hide(this.anchor);
    }
}
