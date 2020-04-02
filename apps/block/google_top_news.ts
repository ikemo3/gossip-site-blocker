import { $ } from '../common';
import { SearchResultToBlock } from './block';

class GoogleTopNews implements SearchResultToBlock {
    private readonly element: Element;

    private readonly valid: boolean;

    private readonly url: string;

    private readonly title: string;

    private readonly insertPoint: Element;

    constructor(element: Element) {
        this.element = element;

        const anchor = element.querySelector('a') as HTMLAnchorElement;
        if (anchor === null) {
            this.valid = false;
            return;
        }

        const { href } = anchor;
        if (href === '') {
            this.valid = false;
            return;
        }

        const titleDiv = anchor.querySelector('.nDgy9d');
        if (titleDiv === null) {
            this.valid = false;
            return;
        }

        this.insertPoint = anchor;
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

    public contains(keyword: string): boolean {
        return this.title.includes(keyword);
    }

    public containsInTitle(keyword: string): boolean {
        return this.title.includes(keyword);
    }

    public getElement(): Element {
        return this.element;
    }

    public deleteElement(): void {
        $.removeSelf(this.element);
    }

    public getCompactMenuInsertElement(): Element {
        return this.insertPoint;
    }

    public getPosition(): string {
        return 'relative';
    }

    public getUrl(): string {
        return this.url;
    }

    public getCssClass(): string {
        return 'block-google-top-news';
    }
}

export default GoogleTopNews;
