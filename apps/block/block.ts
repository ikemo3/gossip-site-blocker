import { MenuPosition } from '../common';
import { Options } from '../repository/config';

export interface ContentToBlock {
    getUrl(): string;

    contains(keyword: string): boolean;

    containsInTitle(keyword: string): boolean;
}

export abstract class SearchResultToBlock implements ContentToBlock {
    abstract getUrl(): string;

    abstract canRetry(): boolean;

    abstract canBlock(): boolean;

    contains(keyword: string): boolean {
        if (this.getTitle().includes(keyword)) {
            return true;
        }

        return this.getContents().includes(keyword);
    }

    abstract getTitle(): string;

    abstract getContents(): string;

    containsInTitle(keyword: string): boolean {
        return this.getTitle().includes(keyword);
    }

    deleteElement(): void {
        const element = this.getElement();
        const parent = element.parentElement;
        if (!parent) {
            return;
        }

        parent!.removeChild(element);
    }

    abstract getElement(): Element;

    abstract getCompactMenuInsertElement(): Element;

    getMenuPosition(option: MenuPosition): MenuPosition {
        return option;
    }

    abstract getPosition(): string;

    abstract getCssClass(): string;

    isShowBlockMenu(_: Options): boolean {
        return true;
    }
}
