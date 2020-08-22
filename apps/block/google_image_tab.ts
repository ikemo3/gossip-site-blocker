import { SearchResultToBlock } from './block';
import DocumentURL from '../values/document_url';
import { Options } from '../repository/config';
import { MenuPosition } from '../common';

class GoogleImageTab extends SearchResultToBlock {
    private readonly valid: boolean;

    private readonly _canRetry: boolean;

    private readonly title: string;

    private readonly url: string;

    private readonly element: Element;

    private readonly compactMenuInsertElement: Element;

    static isOptionallyEnabled(options: Options): boolean {
        return options.blockGoogleImagesTab;
    }

    static isCandidate(element: Element, documentURL: DocumentURL): boolean {
        return element.classList.contains('MSM1fd') && documentURL.isGoogleSearchImageTab();
    }

    // noinspection DuplicatedCode
    constructor(element: Element) {
        super();
        this.element = element;

        const anchor = element.querySelector('a.VFACy');
        if (!anchor) {
            this.valid = false;
            this._canRetry = true;
            return;
        }

        const href = anchor.getAttribute('href');
        if (!href) {
            this.valid = false;
            this._canRetry = true;
            return;
        }

        const image = element.querySelector('img.Q4LuWd');
        if (!image) {
            this.valid = false;
            this._canRetry = true;
            return;
        }

        const alt = image.getAttribute('alt');
        this.title = alt || '';
        this.url = href;
        this.valid = true;
        this._canRetry = true;
        this.compactMenuInsertElement = anchor;
    }

    canBlock(): boolean {
        return this.valid;
    }

    canRetry(): boolean {
        return this._canRetry;
    }

    getCompactMenuInsertElement(): Element {
        return this.compactMenuInsertElement;
    }

    getCssClass(): string {
        return 'block-google-image-tab';
    }

    getElement(): Element {
        return this.element;
    }

    getPosition(): string {
        return 'absolute';
    }

    getUrl(): string {
        return this.url;
    }

    getContents(): string {
        return '';
    }

    getTitle(): string {
        return this.title;
    }

    getMenuPosition(_: MenuPosition): MenuPosition {
        return MenuPosition.COMPACT;
    }
}

export default GoogleImageTab;
