/**
 * Block target element.
 */
class BlockTarget {
    constructor(mediator, element) {
        this.mediator = mediator;
        this.element = element;
    }
    remove() {
        $.removeSelf(this.element);
    }
    getDOMElement() {
        return this.element;
    }
    show() {
        this.element.removeAttribute("data-blocker-display");
    }
    hide() {
        this.element.setAttribute("data-blocker-display", "none");
    }
    temporarilyUnblock() {
        this.element.setAttribute("data-blocker-display", "unhide");
    }
}
//# sourceMappingURL=block_target.js.map