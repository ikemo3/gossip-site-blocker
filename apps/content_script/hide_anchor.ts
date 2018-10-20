class HideAnchor {
    private readonly anchor: HTMLAnchorElement;
    private readonly br: HTMLBRElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator, div: HTMLDivElement) {
        this.mediator = mediator;

        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.textContent = chrome.i18n.getMessage("hideThisPage");
        anchor.addEventListener("click", this.mediator.hide.bind(this.mediator));

        const br = document.createElement("br");

        div.appendChild(anchor);
        div.appendChild(br);

        this.anchor = anchor;
        this.br = br;
    }

    public none() {
        this.anchor.style.display = "none";
        this.br.style.display = "none";
    }

    public unhide() {
        this.anchor.style.display = "inline";
        this.br.style.display = "inline";
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
