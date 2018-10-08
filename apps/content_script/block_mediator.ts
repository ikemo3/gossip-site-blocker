class BlockMediator {
    private readonly blockTarget: BlockTarget;
    private readonly blockAnchor: BlockAnchor;

    constructor(g: IBlockable,
                blockState: BlockState,
                id: string) {
        const blockTarget = new BlockTarget(this, g.getElement(), g.getUrl(), id, blockState.state);
        const blockAnchor = new BlockAnchor(this, id, blockState.state, g.getUrl(), blockState.reason);

        this.blockTarget = blockTarget;
        this.blockAnchor = blockAnchor;

        // insert anchor after target.
        DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
    }

    public setWrappable(width: string) {
        this.blockAnchor.setWrappable(width);
    }

    public hide() {
        this.blockAnchor.hide();
        this.blockTarget.hide();
    }

    public unhide() {
        this.blockAnchor.unhide();
        this.blockTarget.unhide();
    }

    public async block(url: string, blockType: string) {
        await BlockedSitesRepository.add(url, blockType);
        this.blockAnchor.block(url, blockType);
        this.blockTarget.block(url);
    }
}
