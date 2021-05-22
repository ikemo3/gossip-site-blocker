import { SearchResultToBlock } from "./block";
import DocumentURL from "../values/document_url";

// noinspection SpellCheckingInspection
const CONTENT_SELECTOR = ".IsZvec";

class GoogleSearchResult extends SearchResultToBlock {
    private readonly valid: boolean;

    private readonly _canRetry: boolean;

    private readonly url: string;

    private readonly element: Element;

    private readonly title: string;

    private readonly contents: string;

    private readonly compactMenuInsertElement: Element;

    static isCandidate(element: Element, documentURL: DocumentURL): boolean {
        return element.classList.contains("g") && documentURL.isGoogleSearch();
    }

    // noinspection DuplicatedCode
    constructor(element: Element) {
        super();
        this.element = element;

        const { classList } = element;

        // ignore if image.
        if (element.matches("#imagebox_bigimages")) {
            this.valid = false;
            this._canRetry = false;
            return;
        }

        // ignore if dictionary.
        if (element.querySelector("#dictionary-modules") !== null) {
            this.valid = false;
            this._canRetry = false;
            return;
        }

        // ignore if any element has class=g
        let parent = element.parentElement;
        for (;;) {
            // when root element
            if (parent === null) {
                break;
            }

            if (parent.classList.contains("g")) {
                this.valid = false;
                this._canRetry = false;
                return;
            }

            parent = parent.parentElement;
        }

        // ignore right pane
        if (classList.contains("rhsvw")) {
            this.valid = false;
            this._canRetry = false;
            return;
        }

        const anchorList = element.getElementsByTagName("a");

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

            if (href.startsWith("https://webcache.googleusercontent.com/")) {
                continue;
            }

            if (href.startsWith("http://webcache.googleusercontent.com/")) {
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
            this._canRetry = true;
            return;
        }

        const h3 = element.querySelector("h3");

        // ignore if no h3(ex. Google Translate)
        if (h3 === null) {
            this.valid = false;
            this._canRetry = false;
            return;
        }

        const title = h3.textContent ? h3.textContent : "";
        const st: HTMLSpanElement | null = element.querySelector(CONTENT_SELECTOR);
        const contents = st ? st.textContent! : "";

        this.valid = true;
        this._canRetry = true;
        [this.url] = urlList;
        this.title = title;
        this.contents = contents;

        // operation insert point
        const actionMenu = this.element.querySelector(".action-menu");

        if (actionMenu !== null) {
            this.compactMenuInsertElement = actionMenu;
        } else {
            this.compactMenuInsertElement = element.querySelector("a")!;
        }
    }

    public canRetry(): boolean {
        return this._canRetry;
    }

    public canBlock(): boolean {
        return this.valid;
    }

    public getUrl(): string {
        return this.url;
    }

    public getElement(): Element {
        return this.element;
    }

    public getCompactMenuInsertElement(): Element {
        return this.compactMenuInsertElement;
    }

    public getPosition(): string {
        return "absolute";
    }

    public getCssClass(): string {
        return "block-google-element";
    }

    public getTitle(): string {
        return this.title;
    }

    public getContents(): string {
        return this.contents;
    }
}

export default GoogleSearchResult;
