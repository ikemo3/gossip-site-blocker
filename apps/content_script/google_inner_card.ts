class GoogleInnerCard implements IBlockable {
    public valid: boolean;
    public url: string;
    public element: Element;
    private readonly title: string;

    constructor(element: Element) {
        const anchorList = element.getElementsByTagName("a");

        const urlList = [];
        for (const anchor of anchorList) {
            const href = anchor.getAttribute("href");

            if (href === null) {
                continue;
            }

            urlList.push(href);
        }

        // ignore if no anchor.
        if (urlList.length === 0) {
            this.valid = false;
            return;
        }

        const heading = element.querySelector("[role=heading]");
        if (heading) {
            this.title = heading.textContent!;
        }

        this.valid = true;
        this.url = urlList[0];
        this.element = element;
    }

    public canBlock() {
        return this.valid;
    }

    public getUrl() {
        return this.url;
    }

    public getElement() {
        return this.element;
    }

    public deleteElement() {
        this.element.parentElement!.removeChild(this.element);
    }

    public contains(keyword: string): boolean {
        return this.title !== "" && this.title.includes(keyword);
    }
}
