class BlockMediator {
    constructor(g, blockState, id) {
        const blockTarget = new BlockTarget(this, g.getElement(), g.getUrl(), id, blockState.state);
        const blockAnchor = new BlockAnchor(this, id, blockState.state, blockTarget, g.getUrl(), blockState.reason);
        this.blockTarget = blockTarget;
        this.blockAnchor = blockAnchor;
        // insert anchor after target.
        DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
    }
    setWrappable(width) {
        this.blockAnchor.setWrappable(width);
    }
}
//# sourceMappingURL=block_mediator.js.map