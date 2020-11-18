import { SearchResultToBlock } from './block';
import DocumentURL from '../values/document_url';
import { Options } from '../repository/options';

class GoogleSearchMovie extends SearchResultToBlock {
    private readonly element: Element;

    private readonly valid: boolean;

    private readonly url: string;

    private readonly title: string;

    private readonly compactMenuInsertElement: Element;

    static isOptionallyEnabled(options: Options): boolean {
        return options.blockGoogleSearchMovie;
    }

    static isCandidate(element: Element, documentURL: DocumentURL): boolean {
        return element.classList.contains('VibNM') && !documentURL.isGoogleSearchNewsTab();
    }

    // noinspection DuplicatedCode
    constructor(element: Element) {
        super();
        this.element = element;

        const anchor = element.querySelector('a');
        if (anchor === null) {
            this.valid = false;
            return;
        }

        const { href } = anchor;
        if (href === '') {
            this.valid = false;
            return;
        }

        const titleDiv = anchor.querySelector('.fJiQld');
        if (titleDiv === null) {
            this.valid = false;
            return;
        }

        this.compactMenuInsertElement = anchor;
        this.valid = true;
        this.url = href;
        this.title = titleDiv.textContent !== null ? titleDiv.textContent : '';
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
        return 'relative';
    }

    public getUrl(): string {
        return this.url;
    }

    public getCssClass(): string {
        return 'block-google-movie';
    }

    public getTitle(): string {
        return this.title;
    }

    public getContents(): string {
        return '';
    }
}

export default GoogleSearchMovie;
