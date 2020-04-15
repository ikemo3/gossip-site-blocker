import { SearchResultToBlock } from './block';
import DocumentURL from '../values/document_url';
import { Options } from '../repository/config';

class GoogleNewsTabCardSection extends SearchResultToBlock {
    private readonly valid: boolean;

    private readonly url: string;

    private readonly element: Element;

    private readonly title: string;

    private readonly contents: string;

    private readonly compactMenuInsertElement: Element;

    static isOptionallyEnabled(options: Options): boolean {
        return options.blockGoogleNewsTab;
    }

    static isCandidate(element: Element, documentURL: DocumentURL): boolean {
        return element.matches('div.card-section') && documentURL.isGoogleSearchNewsTab();
    }

    // noinspection DuplicatedCode
    constructor(element: Element) {
        super();
        this.element = element;

        const anchor = element.querySelector('a.RTNUJf');
        if (!anchor) {
            this.valid = false;
            return;
        }

        let href = anchor.getAttribute('href') as string;

        // firefox, coccoc, ...
        if (href.startsWith('/url?')) {
            const matchData = href.match('&url=(.*)&');
            if (matchData !== null) {
                [href] = matchData;
            }
        }

        const title = anchor.textContent ? anchor.textContent : '';
        const st: HTMLSpanElement | null = element.querySelector('.st');
        const contents = st ? st.textContent! : '';

        this.valid = true;
        this.url = href;
        this.title = title;
        this.contents = contents;

        // operation insert point
        const actionMenu = this.element.querySelector('.action-menu');

        if (actionMenu !== null) {
            this.compactMenuInsertElement = actionMenu;
        } else {
            this.compactMenuInsertElement = element.querySelector('a')!;
        }
    }

    public canRetry(): boolean {
        return true;
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
        return 'absolute';
    }

    public getCssClass(): string {
        return 'block-google-news-card-section';
    }

    public getTitle(): string {
        return this.title;
    }

    public getContents(): string {
        return this.contents;
    }
}

export default GoogleNewsTabCardSection;
