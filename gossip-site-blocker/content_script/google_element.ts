class GoogleElement {
    public valid: boolean;
    public url: string;
    public element: Element;
    private readonly title: string;
    private readonly contents: string;

    constructor(element) {
        const classList = element.classList;

        // ignore if any element has class=g
        let parent = element.parentElement;
        while (true) {
            // when root element
            if (parent === null) {
                break;
            }

            if (parent.classList.contains("g")) {
                this.valid = false;
                return;
            }

            parent = parent.parentElement;
        }

        // ignore right pane
        if (classList.contains("rhsvw")) {
            this.valid = false;
            return;
        }

        const anchorList = element.getElementsByTagName("a");

        const urlList = [];
        for (const anchor of anchorList) {
            const href = anchor.getAttribute("href");

            if (href === null) {
                continue;
            }

            // menu, etc...
            if (href === "#") {
                continue;
            }

            // ignore cache link.
            if (href.startsWith("https://webcache.googleusercontent.com")) {
                continue;
            }

            if (href.startsWith("http://webcache.googleusercontent.com")) {
                continue;
            }

            // ignore related link.
            if (href.startsWith("/search?")) {
                continue;
            }

            urlList.push(href);
        }

        // ignore if no anchor.
        if (urlList.length === 0) {
            this.valid = false;
            return;
        }

        const title = element.querySelector("a h3").textContent;
        const contents = element.querySelector(".st").textContent;

        this.valid = true;
        this.url = urlList[0];
        this.element = element;
        this.title = title;
        this.contents = contents;
    }

    public canBlock() {
        return this.valid;
    }

    public contains(keyword: string): boolean {
        if (this.title && this.title.includes(keyword)) {
            return true;
        }

        return this.contents && this.contents.includes(keyword);
    }

    public getUrl() {
        return this.url;
    }

    public getElement() {
        return this.element;
    }

    public deleteElement() {
        this.element.parentElement.removeChild(this.element);
    }
}
