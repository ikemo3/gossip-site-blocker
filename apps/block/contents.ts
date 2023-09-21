import { KeywordType, MenuPositionType } from "../storage/enums";
import { containsInTitle } from "./libs";
import { containsInTitleOrContents } from "./libs";

export interface ContentToBlock {
  getUrl(): string;

  contains(keyword: string, keywordType: KeywordType): boolean;

  containsInTitle(keyword: string, keywordType: KeywordType): boolean;
}

export abstract class SearchResultToBlock implements ContentToBlock {
  abstract getUrl(): string;

  abstract canRetry(): boolean;

  abstract canBlock(): boolean;

  contains(keyword: string, keywordType: KeywordType): boolean {
    const title = this.getTitle();
    const contents = this.getContents();
    return containsInTitleOrContents(keywordType, keyword, title, contents);
  }

  abstract getTitle(): string;

  abstract getContents(): string;

  containsInTitle(keyword: string, keywordType: KeywordType): boolean {
    const title = this.getTitle();
    return containsInTitle(keywordType, keyword, title);
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

  getMenuPosition(option: MenuPositionType): MenuPositionType {
    return option;
  }

  abstract getPosition(): string;

  abstract getCssClass(): string;
}
