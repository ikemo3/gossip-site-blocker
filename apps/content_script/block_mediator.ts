class BlockMediator {
    private readonly url: string;
    private readonly reason: string | null;
    private readonly blockTarget: BlockTarget;
    private readonly blockAnchor: BlockAnchor;
    private readonly operationDiv: HTMLDivElement;
    private readonly unhideAnchor: UnhideAnchor;
    private readonly hideAnchor: HideAnchor;

    constructor(g: IBlockable, blockState: BlockState, id: string) {
        const operationDiv = document.createElement("div");
        operationDiv.classList.add("block-anchor");

        const blockTarget = new BlockTarget(this, g.getElement(), g.getUrl(), id, blockState.state);
        const blockAnchor = new BlockAnchor(this, operationDiv, id);

        const unhideAnchor = new UnhideAnchor(this, operationDiv, id);
        const hideAnchor = new HideAnchor(this, operationDiv, id);

        this.url = g.getUrl();
        this.reason = blockState.reason;
        this.blockTarget = blockTarget;
        this.blockAnchor = blockAnchor;
        this.operationDiv = operationDiv;
        this.unhideAnchor = unhideAnchor;
        this.hideAnchor = hideAnchor;

        // insert anchor after target.
        DOMUtils.insertAfter(blockTarget.getDOMElement(), this.operationDiv);

        switch (blockState.state) {
            case "none":
                this.none();
                break;

            case "soft":
                this.hide();
                break;
        }
    }

    public setWrappable(width: string) {
        this.operationDiv.style.width = width;
        this.operationDiv.style.whiteSpace = "normal";
    }

    public none() {
        this.blockAnchor.none();
        this.blockTarget.none();
        this.unhideAnchor.none();
        this.hideAnchor.none();
    }

    public hide() {
        this.blockAnchor.hide();
        this.blockTarget.hide();
        this.unhideAnchor.hide(this.reason!);
        this.hideAnchor.hide();
    }

    public unhide() {
        this.blockAnchor.unhide();
        this.blockTarget.unhide();
        this.unhideAnchor.unhide();
        this.hideAnchor.unhide();
    }

    public async block(url: string, blockType: string) {
        await BlockedSitesRepository.add(url, blockType);
        if (blockType === "hard") {
            this.blockTarget.remove();
            this.operationDiv.parentElement!.removeChild(this.operationDiv);
            return;
        }

        this.blockAnchor.block();
        this.blockTarget.block(url);
        this.unhideAnchor.block(url);
        this.hideAnchor.block();
    }

    public showBlockDialog() {
        // show dialog.
        new BlockDialog(this, this.url);
    }

    public async blockPage(url: string, blockType: string) {
        await this.block(url, blockType);
    }
}
