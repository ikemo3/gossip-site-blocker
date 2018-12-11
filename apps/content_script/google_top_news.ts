class GoogleTopNews implements IBlockable {
    private readonly element: Element;
    private readonly valid: boolean;
    private readonly url: string;
    private readonly title: string;
    private readonly insertPoint: Element;

    constructor(element: Element) {
        const anchor = element.querySelector("a") as HTMLAnchorElement;
        if (anchor === null) {
            this.valid = false;
            return;
        }

        const href = anchor.href;
        if (href === "") {
            this.valid = false;
            return;
        }

        const titleDiv = anchor.querySelector(".rrBdId");
        if (titleDiv === null) {
            this.valid = false;
            return;
        }

        this.insertPoint = anchor;
        this.valid = true;
        this.url = href;
        this.element = element;
        this.title = titleDiv.textContent !== null ? titleDiv.textContent : "";
    }

    public canBlock(): boolean {
        return this.valid;
    }

    public contains(keyword: string): boolean {
        return this.title.includes(keyword);
    }

    public getElement(): Element {
        return this.element;
    }

    public deleteElement() {
        $.removeSelf(this.element);
    }

    public getOperationInsertPoint(): Element {
        return this.insertPoint;
    }

    public getPosition(): string {
        return "relative";
    }

    public getUrl(): string {
        return this.url;
    }

    public getCssClass(): string {
        return "block-google-top-news";
    }
}
