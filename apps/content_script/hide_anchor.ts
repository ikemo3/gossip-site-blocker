import { $ } from '../common';
import { IBlockMediator } from './mediator';
import { Anchor } from './anchor';

export class HideAnchor implements Anchor {
    private readonly anchor: HTMLAnchorElement;

    private readonly mediator: IBlockMediator;

    constructor(mediator: IBlockMediator) {
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
