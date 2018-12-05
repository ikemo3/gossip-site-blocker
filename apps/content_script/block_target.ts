/**
 * Block target element.
 */
class BlockTarget {
    private readonly mediator: BlockMediator;
    private readonly element: Element;

    constructor(mediator: BlockMediator, element: Element) {
        this.mediator = mediator;
        this.element = element;
    }

    public remove() {
        $.removeSelf(this.element);
    }

    public getDOMElement() {
        return this.element;
    }

    public show() {
        this.element.removeAttribute("data-blocker-display");
    }

    public hide() {
        this.element.setAttribute("data-blocker-display", "none");
    }

    public temporarilyUnblock() {
        this.element.setAttribute("data-blocker-display", "unhide");
    }
}
