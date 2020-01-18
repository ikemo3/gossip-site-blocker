import { $ } from '../common';
import { Blockable } from './blockable';

class GoogleTopNews implements Blockable {
    private readonly element: Element;

    private readonly valid: boolean;

    private readonly url: string;

    private readonly title: string;

    private readonly insertPoint: Element;

    constructor(element: Element) {
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
        this.element = element;
        this.title = titleDiv.textContent !== null ? titleDiv.textContent : '';
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

    public getOperationInsertPoint(): Element {
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
