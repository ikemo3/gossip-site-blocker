import { BlockMediator } from './block_mediator';
import { $ } from '../common';

export class TemporarilyUnblockAnchor {
    private readonly anchor: HTMLAnchorElement;

    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor();
        anchor.classList.add('blocker-temporarily-unblock');
        $.onclick(anchor, this.mediator.temporarilyUnblock.bind(this.mediator));

        this.anchor = anchor;
    }

    public getElement(): Element {
        return this.anchor;
    }

    public show(reason: string): void {
        $.show(this.anchor);
        $.text(this.anchor, TemporarilyUnblockAnchor.message(reason));
    }

    public hide(): void {
        $.hide(this.anchor);
    }

    private static message(reason: string): string {
        return chrome.i18n.getMessage('temporarilyUnblock', [$.decodeURI(reason)]);
    }
}
