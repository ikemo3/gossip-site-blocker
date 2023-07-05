import { KeywordType, MenuPositionType } from "../repository/enums";
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

export function containsInTitleOrContents(
  keywordType: KeywordType,
  keyword: string,
  title: string,
  contents: string,
) {
  if (keywordType === KeywordType.REGEXP) {
    if (matchesByRegExp(title, keyword)) {
      return true;
    }

    return matchesByRegExp(contents, keyword);
  }

  if (title.includes(keyword)) {
    return true;
  }

  return contents.includes(keyword);
}

export function containsInTitle(
  keywordType: KeywordType,
  keyword: string,
  title: string,
) {
  if (keywordType === KeywordType.REGEXP) {
    return matchesByRegExp(title, keyword);
  }

  return title.includes(keyword);
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
