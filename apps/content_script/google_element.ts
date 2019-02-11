class GoogleElement implements IBlockable {
    private readonly valid: boolean;
    private readonly ignoreExplicitly: boolean;
    private readonly url: string;
    private readonly element: Element;
    private readonly title: string;
    private readonly contents: string;
    private readonly operationInsertPoint: Element;

    constructor(element: Element) {
        const classList = element.classList;

        // ignore if image.
        if (element.matches("#imagebox_bigimages")) {
            this.valid = false;
            this.ignoreExplicitly = true;
            return;
        }

        // ignore if dictionary.
        if (element.querySelector("#dictionary-modules") !== null) {
            this.valid = false;
            this.ignoreExplicitly = true;
            return;
        }

        // ignore if any element has class=g
        let parent = element.parentElement;
        while (true) {
            // when root element
            if (parent === null) {
                break;
            }

            if (parent.classList.contains("g")) {
                this.valid = false;
                this.ignoreExplicitly = true;
                return;
            }

            parent = parent.parentElement;
        }

        // ignore right pane
        if (classList.contains("rhsvw")) {
            this.valid = false;
            this.ignoreExplicitly = true;
            return;
        }

        const anchorList: NodeListOf<HTMLAnchorElement> = element.getElementsByTagName("a");

        const urlList: string[] = [];
        for (const anchor of anchorList) {
            const ping = anchor.getAttribute("ping");
            const href = anchor.getAttribute("href");
            const onmouseDown = anchor.getAttribute("onmousedown");

            if (href === null) {
                continue;
            }

            if (!href.startsWith("https://books.google") && ping === null && onmouseDown == null) {
                continue;
            }

            // firefox, coccoc, ...
            if (href.startsWith("/url?")) {
                const matchData = href.match("&url=(.*)&");
                if (matchData !== null) {
                    urlList.push(matchData[0]);
                }
            } else {
                urlList.push(href);
            }
        }

        // ignore if no anchor.
        if (urlList.length === 0) {
            this.valid = false;
            this.ignoreExplicitly = false;
            return;
        }

        const h3 = element.querySelector("h3");

        // ignore if no h3(ex. Google Translate)
        if (h3 === null) {
            this.valid = false;
            this.ignoreExplicitly = true;
            return;
        }

        const title = h3.textContent ? h3.textContent : "";
        const st: HTMLSpanElement | null = element.querySelector(".st");
        const contents = st ? st.textContent! : "";

        this.valid = true;
        this.ignoreExplicitly = false;
        this.url = urlList[0];
        this.element = element;
        this.title = title;
        this.contents = contents;

        // operation insert point
        const actionMenu = this.element.querySelector(".action-menu");

        if (actionMenu !== null) {
            this.operationInsertPoint = actionMenu;
        } else {
            this.operationInsertPoint = element.querySelector("a")!;
        }
    }

    public isIgnoreable() {
        return this.ignoreExplicitly;
    }

    public canBlock() {
        return this.valid;
    }

    public contains(keyword: string): boolean {
        if (this.title.includes(keyword)) {
            return true;
        }

        return this.contents !== "" && this.contents.includes(keyword);
    }

    public containsInTitle(keyword: string): boolean {
        return this.title.includes(keyword);
    }

    public getUrl(): string {
        return this.url;
    }

    public getElement(): Element {
        return this.element;
    }

    public getOperationInsertPoint(): Element {
        return this.operationInsertPoint;
    }

    public deleteElement() {
        this.element.parentElement!.removeChild(this.element);
    }

    public getPosition(): string {
        return "absolute";
    }

    public getCssClass(): string {
        return "block-google-element";
    }
}
