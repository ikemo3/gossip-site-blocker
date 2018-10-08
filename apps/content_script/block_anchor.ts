class BlockAnchor {
    private readonly anchor: HTMLAnchorElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator, div: HTMLDivElement, targetId: string) {
        this.mediator = mediator;

        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.setAttribute("data-blocker-target-id", targetId);
        anchor.textContent = chrome.i18n.getMessage("blockThisPage");
        anchor.addEventListener("click", this.mediator.showBlockDialog.bind(this.mediator));

        div.appendChild(anchor);

        this.anchor = anchor;
    }

    public none() {
        this.anchor.style.display = "inline";
    }

    public unhide() {
        this.anchor.style.display = "none";
    }

    public hide() {
        this.anchor.style.display = "none";
    }

    public block() {
        this.anchor.style.display = "none";
    }
}
