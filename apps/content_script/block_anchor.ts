class BlockAnchor {
    private readonly anchor: HTMLAnchorElement;
    private readonly br: HTMLBRElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator, div: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.textContent = chrome.i18n.getMessage("blockThisPage");
        anchor.addEventListener("click", this.mediator.showBlockDialog.bind(this.mediator));

        const br = document.createElement("br");

        div.appendChild(anchor);
        div.appendChild(br);

        this.anchor = anchor;
        this.br = br;
    }

    public none() {
        this.anchor.style.display = "inline";
        this.br.style.display = "inline";
    }

    public unhide(blockReason: BlockReason) {
        if (blockReason.getType() !== BlockType.URL) {
            this.anchor.style.display = "inline";
            this.br.style.display = "inline";
            this.anchor.textContent = chrome.i18n.getMessage("blockThisPageExplicitly");
        } else {
            this.anchor.style.display = "none";
            this.br.style.display = "none";
            this.anchor.textContent = chrome.i18n.getMessage("blockThisPage");
        }
    }

    public hide() {
        this.anchor.style.display = "none";
        this.br.style.display = "none";
    }

    public block() {
        this.anchor.style.display = "none";
        this.br.style.display = "none";
    }
}
