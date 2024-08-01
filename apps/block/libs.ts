import { Logger } from "../libs/logger";
import { KeywordType } from "../storage/enums";

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

export function matchesByRegExp(contents: string, keyword: string): boolean {
  try {
    const regexp = new RegExp(keyword);
    return regexp.test(contents);
  } catch (_e) {
    Logger.log(`Invalid regexp: ${keyword}`);
    return false;
  }
}
