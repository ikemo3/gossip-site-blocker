import { KeywordType, MenuPosition } from "../repository/enums";
import { Logger } from "../common";

export interface ContentToBlock {
    getUrl(): string;

    contains(keyword: string, keywordType: KeywordType): boolean;

    containsInTitle(keyword: string, keywordType: KeywordType): boolean;
}

function matchesByRegExp(contents: string, keyword: string): boolean {
    try {
        const regexp = new RegExp(keyword);
        return regexp.test(contents);
    } catch (e) {
        Logger.log(`Invalid regexp: ${keyword}`);
        return false;
    }
}

export abstract class SearchResultToBlock implements ContentToBlock {
    abstract getUrl(): string;

    abstract canRetry(): boolean;

    abstract canBlock(): boolean;

    contains(keyword: string, keywordType: KeywordType): boolean {
        if (keywordType === KeywordType.REGEXP) {
            if (matchesByRegExp(this.getTitle(), keyword)) {
                return true;
            }

            return matchesByRegExp(this.getContents(), keyword);
        }

        if (this.getTitle().includes(keyword)) {
            return true;
        }

        return this.getContents().includes(keyword);
    }

    abstract getTitle(): string;

    abstract getContents(): string;

    containsInTitle(keyword: string, keywordType: KeywordType): boolean {
        if (keywordType === KeywordType.REGEXP) {
            return matchesByRegExp(this.getTitle(), keyword);
        }

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
}
