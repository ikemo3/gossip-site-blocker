import { $ } from '../common';
import { BlockMediator } from './block_mediator';

/**
 * Block target element.
 */
export class BlockTarget {
    private readonly mediator: BlockMediator;

    private readonly element: Element;

    constructor(mediator: BlockMediator, element: Element) {
        this.mediator = mediator;
        this.element = element;
    }

    public remove(): void {
        $.removeSelf(this.element);
    }

    public getDOMElement(): Element {
        return this.element;
    }

    public show(): void {
        this.element.removeAttribute('data-blocker-display');
    }

    public hide(): void {
        this.element.setAttribute('data-blocker-display', 'none');
    }

    public temporarilyUnblock(): void {
        this.element.setAttribute('data-blocker-display', 'unhide');
    }
}
