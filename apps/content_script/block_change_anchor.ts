class BlockChangeAnchor {
    private readonly anchor: HTMLAnchorElement;
    private readonly url: string;
    private readonly reason: string | null;

    constructor(parent: Element,
                url: string,
                reason: string | null) {
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        anchor.textContent = "change state";

        anchor.addEventListener("click", this.onclick.bind(this));

        parent.appendChild(anchor);
        this.anchor = anchor;
        this.url = url;
        this.reason = reason;
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

    private onclick(): void {
        const dialog = new BlockChangeAnchorDialog(this.url, this.reason);
    }
}
