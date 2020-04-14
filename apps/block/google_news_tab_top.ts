import { SearchResultToBlock } from './block';

class GoogleNewsTabTop extends SearchResultToBlock {
    private readonly valid: boolean;

    private readonly _canRetry: boolean;

    private readonly url: string;

    private readonly element: Element;

    private readonly title: string;

    private readonly contents: string;

    private readonly operationInsertPoint: Element;

    // noinspection DuplicatedCode
    constructor(element: Element) {
        super();
        this.element = element;

        const anchor: HTMLAnchorElement | null = element.querySelector('a');
        if (anchor === null) {
            this.valid = false;
            this._canRetry = true;
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

        const h3 = element.querySelector('h3');

        // ignore if no h3(ex. Google Translate)
        if (h3 === null) {
            this.valid = false;
            this._canRetry = false;
            return;
        }

        const title = h3.textContent ? h3.textContent : '';
        const st: HTMLSpanElement | null = element.querySelector('.st');
        const contents = st ? st.textContent! : '';

        this.valid = true;
        this._canRetry = true;
        this.url = href;
        this.title = title;
        this.contents = contents;

        // operation insert point
        const actionMenu = this.element.querySelector('.action-menu');

        if (actionMenu !== null) {
            this.operationInsertPoint = actionMenu;
        } else {
            this.operationInsertPoint = element.querySelector('a')!;
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
        return this.operationInsertPoint;
    }

    public deleteElement(): void {
        const imageLink = this.element.previousSibling;
        if (imageLink instanceof HTMLAnchorElement) {
            imageLink.removeAttribute('href');
        }

        this.element.parentElement!.removeChild(this.element);
    }

    public getPosition(): string {
        return 'absolute';
    }

    public getCssClass(): string {
        return 'block-google-news-top';
    }

    public getTitle(): string {
        return this.title;
    }

    public getContents(): string {
        return this.contents;
    }
}

export default GoogleNewsTabTop;
