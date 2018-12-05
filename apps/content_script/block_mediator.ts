class BlockMediator {
    private readonly url: string;
    private blockReason: BlockReason | null;
    private readonly blockTarget: BlockTarget;

    private readonly operationDiv: HTMLDivElement;
    private readonly hideAnchor: HideAnchor;
    private readonly separator1: HTMLSpanElement;
    private readonly temporarilyUnblockAnchor: TemporarilyUnblockAnchor;
    private readonly blockAnchor: BlockAnchor;
    private readonly changeAnchor: BlockChangeAnchor;

    private readonly defaultBlockType: string;
    private blockDialog: BlockDialog;
    private changeStateDialog: BlockChangeAnchorDialog;

    constructor(g: IBlockable, blockState: BlockState, defaultBlockType: string) {
        const blockTarget = new BlockTarget(this, g.getElement());

        this.url = g.getUrl();
        this.separator1 = $.span(" ");
        this.blockReason = blockState.getReason();
        this.blockTarget = blockTarget;
        this.blockAnchor = new BlockAnchor(this);
        this.operationDiv = $.div("block-anchor");
        this.temporarilyUnblockAnchor = new TemporarilyUnblockAnchor(this);
        this.hideAnchor = new HideAnchor(this);
        this.changeAnchor = new BlockChangeAnchor(this);
        this.defaultBlockType = defaultBlockType;

        // insert anchors to operationDiv
        this.operationDiv.appendChild(this.hideAnchor.getElement());
        this.operationDiv.appendChild(this.separator1);
        this.operationDiv.appendChild(this.blockAnchor.getElement());
        this.operationDiv.appendChild(this.temporarilyUnblockAnchor.getElement());
        this.operationDiv.appendChild(this.changeAnchor.getElement());

        // insert anchor after target.
        DOMUtils.insertAfter(blockTarget.getDOMElement(), this.operationDiv);

        switch (blockState.getState()) {
            case "none":
                this.notBlocked();
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

    public notBlocked() {
        this.blockAnchor.showBlockThisPage();
        this.blockTarget.show();
        this.temporarilyUnblockAnchor.hide();
        this.hideAnchor.hide();
        this.changeAnchor.hide();
    }

    public hide() {
        this.blockAnchor.hide();
        this.blockTarget.hide();
        this.temporarilyUnblockAnchor.show(this.blockReason!.getWord());
        this.hideAnchor.hide();
        this.changeAnchor.hide();
    }

    public temporarilyUnblock() {
        if (this.blockReason!.getType() !== BlockType.URL_EXACTLY) {
            this.blockAnchor.showBlockExplicitly();
            this.changeAnchor.hide();
        } else {
            this.blockAnchor.hide();
            this.changeAnchor.show();
        }

        this.blockTarget.temporarilyUnblock();
        this.temporarilyUnblockAnchor.hide();
        this.hideAnchor.show();
    }

    public async toHard(url: string) {
        await BlockedSitesRepository.toHard(url);
        this.blockTarget.remove();
        $.removeSelf(this.operationDiv);
    }

    public async unblock(url: string) {
        await BlockedSitesRepository.del(url);
        this.notBlocked();
    }

    public async block(url: string, blockType: string) {
        await BlockedSitesRepository.add(url, blockType);
        if (blockType === "hard") {
            this.blockTarget.remove();
            $.removeSelf(this.operationDiv);
            return;
        }

        if (DOMUtils.removeProtocol(this.url) === url) {
            this.blockReason = new BlockReason(BlockType.URL_EXACTLY, url);
        } else {
            this.blockReason = new BlockReason(BlockType.URL, url);
        }

        this.hide();
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
