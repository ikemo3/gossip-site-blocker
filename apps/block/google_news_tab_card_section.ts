import { SearchResultToBlock } from './block';


class GoogleNewsTabCardSection implements SearchResultToBlock {
    private readonly valid: boolean;

    private readonly url: string;

    private readonly element: Element;

    private readonly title: string;

    private readonly contents: string;

    private readonly operationInsertPoint: Element;

    constructor(element: Element) {
        this.element = element;

        const anchor = element.querySelector('a.RTNUJf') as HTMLAnchorElement;
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
            this.operationInsertPoint = actionMenu;
        } else {
            this.operationInsertPoint = element.querySelector('a')!;
        }
    }

    public canRetry(): boolean {
        return true;
    }

    public canBlock(): boolean {
        return this.valid;
    }

    public contains(keyword: string): boolean {
        if (this.title.includes(keyword)) {
            return true;
        }

        return this.contents !== '' && this.contents.includes(keyword);
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

    public getCompactMenuInsertElement(): Element {
        return this.operationInsertPoint;
    }

    public deleteElement(): void {
        this.element.parentElement!.removeChild(this.element);
    }

    public getPosition(): string {
        return 'absolute';
    }

    public getCssClass(): string {
        return 'block-google-news-card-section';
    }
}

export default GoogleNewsTabCardSection;
