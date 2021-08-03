import { SearchResultToBlock } from "./block";
import DocumentURL from "../values/document_url";

class GoogleSearchTopNews extends SearchResultToBlock {
    private readonly element: Element;

    private readonly valid: boolean;

    private readonly url: string;

    private readonly title: string;

    private readonly compactMenuInsertElement: Element;

    static isCandidate(element: Element, documentURL: DocumentURL): boolean {
        return element.matches("g-section-with-header > div[data-ved]") && !documentURL.isGoogleSearchNewsTab();
    }

    // noinspection DuplicatedCode
    constructor(element: Element) {
        super();
        this.element = element;

        const anchor = element.querySelector("a");
        if (anchor === null) {
            this.valid = false;
            return;
        }

        const { href } = anchor;
        if (href === "") {
            this.valid = false;
            return;
        }

        const titleDiv = anchor.querySelector("[role='heading']");
        if (titleDiv === null) {
            this.valid = false;
            return;
        }

        this.compactMenuInsertElement = anchor;
        this.valid = true;
        this.url = href;
        this.title = titleDiv.textContent !== null ? titleDiv.textContent : "";
    }

    public canRetry(): boolean {
        return true;
    }

    public canBlock(): boolean {
        return this.valid;
    }

    public getElement(): Element {
        return this.element;
    }

    public getCompactMenuInsertElement(): Element {
        return this.compactMenuInsertElement;
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

    public getTitle(): string {
        return this.title;
    }

    public getContents(): string {
        return "";
    }
}

export default GoogleSearchTopNews;
