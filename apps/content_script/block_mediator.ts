class BlockMediator {
    private readonly url: string;
    private blockReason: BlockReason | null;
    private readonly blockTarget: BlockTarget;

    private readonly operationDiv: HTMLDivElement;
    private readonly hideAnchor: HideAnchor;
    private readonly separator1: HTMLSpanElement;
    private readonly unhideAnchor: UnhideAnchor;
    private readonly blockAnchor: BlockAnchor;
    private readonly changeAnchor: BlockChangeAnchor;

    private readonly defaultBlockType: string;
    private blockDialog: BlockDialog;
    private changeStateDialog: BlockChangeAnchorDialog;

    constructor(g: IBlockable, blockState: BlockState, defaultBlockType: string) {
        const operationDiv = $.div("block-anchor");

        const blockTarget = new BlockTarget(this, g.getElement(), g.getUrl(), blockState.getState());

        const hideAnchor = new HideAnchor(this, operationDiv);
        this.separator1 = $.span(" ");
        operationDiv.appendChild(this.separator1);
        const blockAnchor = new BlockAnchor(this, operationDiv);
        const unhideAnchor = new UnhideAnchor(this, operationDiv);

        this.url = g.getUrl();
        this.blockReason = blockState.getReason();
        this.blockTarget = blockTarget;
        this.blockAnchor = blockAnchor;
        this.operationDiv = operationDiv;
        this.unhideAnchor = unhideAnchor;
        this.hideAnchor = hideAnchor;
        this.changeAnchor = new BlockChangeAnchor(this, operationDiv);
        this.defaultBlockType = defaultBlockType;

        // insert anchor after target.
        DOMUtils.insertAfter(blockTarget.getDOMElement(), this.operationDiv);

        switch (blockState.getState()) {
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
        this.changeAnchor.none();
    }

    public hide() {
        this.blockAnchor.hide();
        this.blockTarget.hide();
        this.unhideAnchor.hide(this.blockReason!.getWord());
        this.hideAnchor.hide();
        this.changeAnchor.hide();
    }

    public unhide() {
        this.blockAnchor.unhide(this.blockReason!);
        this.blockTarget.unhide();
        this.unhideAnchor.unhide();
        this.hideAnchor.unhide();
        this.changeAnchor.unhide(this.blockReason!);
    }

    public async toHard(url: string) {
        await BlockedSitesRepository.toHard(url);
        this.blockTarget.remove();
        $.removeSelf(this.operationDiv);
    }

    public async unblock(url: string) {
        await BlockedSitesRepository.del(url);
        this.none();
    }

    public async block(url: string, blockType: string) {
        await BlockedSitesRepository.add(url, blockType);
        if (blockType === "hard") {
            this.blockTarget.remove();
            $.removeSelf(this.operationDiv);
            return;
        }

        if (DOMUtils.removeProtocol(this.blockTarget.getUrl()) === url) {
            this.blockReason = new BlockReason(BlockType.URL_EXACTLY, url);
        } else {
            this.blockReason = new BlockReason(BlockType.URL, url);
        }

        this.blockAnchor.block();
        this.blockTarget.block(url);
        this.unhideAnchor.block(url);
        this.hideAnchor.block();
        this.changeAnchor.block();
    }

    public showChangeStateDialog() {
        // show dialog.
        this.changeStateDialog = new BlockChangeAnchorDialog(this, this.url, this.blockReason!.getWord());
    }

    public showBlockDialog() {
        // show dialog.
        this.blockDialog = new BlockDialog(this, this.url, this.defaultBlockType);
    }

    public async blockPage(url: string, blockType: string) {
        await this.block(url, blockType);
    }
}
