class UnhideAnchor {
    private static message(reason: string) {
        return chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(reason)]);
    }

    private readonly anchor: HTMLAnchorElement;
    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator, div: HTMLDivElement, targetId: string) {
        this.mediator = mediator;

        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.setAttribute("data-blocker-target-id", targetId);
        anchor.addEventListener("click", this.mediator.unhide.bind(this.mediator));

        div.appendChild(anchor);

        this.anchor = anchor;
    }

    public none() {
        this.anchor.style.display = "none";
    }

    public hide(reason: string) {
        this.anchor.style.display = "inline";
        this.anchor.textContent = UnhideAnchor.message(reason);
    }

    public unhide() {
        this.anchor.style.display = "none";
    }

    public block(reason: string) {
        this.anchor.style.display = "inline";
        this.anchor.textContent = UnhideAnchor.message(reason);
    }
}
