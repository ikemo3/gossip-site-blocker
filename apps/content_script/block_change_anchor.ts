class BlockChangeAnchor {
    private readonly mediator: BlockMediator;
    private readonly anchor: HTMLAnchorElement;

    constructor(mediator: BlockMediator, parent: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.textContent = chrome.i18n.getMessage("changeBlockState");

        anchor.addEventListener("click", this.mediator.showChangeStateDialog.bind(this));

        parent.appendChild(anchor);

        this.anchor = anchor;
    }

    public changeState(state: string) {
        switch (state) {
            case "unhide":
                this.anchor.style.display = "inline";
                break;
            default:
                this.anchor.style.display = "none";
                break;
        }
    }

    public none() {
        this.anchor.style.display = "none";
    }

    public hide() {
        this.anchor.style.display = "none";
    }

    public unhide(blockReason: BlockReason) {
        if (blockReason.getType() === BlockType.URL_EXACTLY) {
            this.anchor.style.display = "inline";
        } else {
            this.anchor.style.display = "none";
        }
    }

    public block() {
        this.anchor.style.display = "none";
    }
}
