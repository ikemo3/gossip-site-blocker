import { $, DOMUtils } from "../libs/dom";
import { Logger } from "../libs/logger";
import { BlockReason, BlockReasonType } from "../model/block_reason";
import BlockedSite from "../model/blocked_site";
import BlockedSites from "../model/blocked_sites";
import { BannedWord } from "../storage/banned_words";
import { BannedTarget, BlockType, KeywordType } from "../storage/enums";
import { RegExpItem } from "../storage/regexp_repository";

export type ContentToBlockType = {
  getUrl(): string;
  containsInTitle(keyword: string, keywordType: KeywordType): boolean;
  contains(keyword: string, keywordType: KeywordType): boolean;
};

function first<T>(array: Array<T>): T | undefined {
  return array.shift();
}

interface HasBlockType {
  blockType: BlockType;
}

function compare(a: HasBlockType, b: HasBlockType): number {
  if (a.blockType === b.blockType) {
    return 0;
  }

  if (a.blockType === BlockType.SOFT && b.blockType === BlockType.HARD) {
    return 1;
  }

  return -1;
}

function matchesByWord(
  content: ContentToBlockType,
  bannedWord: BannedWord,
): boolean {
  const { keyword, keywordType } = bannedWord;

  switch (bannedWord.target) {
    case BannedTarget.TITLE_ONLY:
      return content.containsInTitle(keyword, keywordType);

    case BannedTarget.TITLE_AND_CONTENTS:
    default:
      return content.contains(keyword, keywordType);
  }
}

function matchesByRegexp(
  content: ContentToBlockType,
  regexpItem: RegExpItem,
): boolean {
  try {
    const pattern = new RegExp(regexpItem.pattern);

    return pattern.test(DOMUtils.removeProtocol(content.getUrl()));
  } catch (e) {
    Logger.log(`Invalid regexp: ${regexpItem.pattern}`);
    return false;
  }
}

class BlockState {
  private readonly state: string;

  private readonly blockReason?: BlockReason;

  constructor(
    content: ContentToBlockType,
    blockedSites: BlockedSites,
    bannedWords: BannedWord[],
    regexpList: RegExpItem[],
    autoBlockIDN: boolean,
  ) {
    // The longest matched site
    const blockedSite: BlockedSite | undefined = blockedSites.matches(
      content.getUrl(),
    );

    // The strongest banned word
    const banned: BannedWord | undefined = first(
      bannedWords
        .filter((bannedWord) => matchesByWord(content, bannedWord))
        .sort(compare),
    );

    // The strongest regexp
    const regexp: RegExpItem | undefined = first(
      regexpList
        .filter((regexpItem) => matchesByRegexp(content, regexpItem))
        .sort(compare),
    );

    if (
      blockedSite &&
      (!banned || banned.blockType !== BlockType.HARD) &&
      (!regexp || regexp.blockType !== BlockType.HARD)
    ) {
      this.state = blockedSite.getState();

      if (DOMUtils.removeProtocol(content.getUrl()) === blockedSite.url) {
        this.blockReason = new BlockReason(
          BlockReasonType.URL_EXACTLY,
          content.getUrl(),
          blockedSite.url,
        );
      } else {
        this.blockReason = new BlockReason(
          BlockReasonType.URL,
          content.getUrl(),
          blockedSite.url,
        );
      }

      return;
    }

    if (banned && (!regexp || regexp.blockType !== BlockType.HARD)) {
      this.state = banned.blockType.toString();
      this.blockReason = new BlockReason(
        BlockReasonType.WORD,
        content.getUrl(),
        banned.keyword,
      );
      return;
    }

    if (regexp) {
      this.state = regexp.blockType.toString();
      this.blockReason = new BlockReason(
        BlockReasonType.REGEXP,
        content.getUrl(),
        regexp.pattern,
      );
      return;
    }

    // check IDN
    if (autoBlockIDN) {
      const url = content.getUrl();
      const hostname = DOMUtils.getHostName(url);

      if (hostname.startsWith("xn--") || hostname.includes(".xn--")) {
        this.state = "soft";
        this.blockReason = new BlockReason(
          BlockReasonType.IDN,
          url,
          $.message("IDN"),
        );
        return;
      }
    }

    this.state = "none";
  }

  public getReason(): BlockReason | undefined {
    return this.blockReason;
  }

  public getState(): string {
    return this.state;
  }
}

export default BlockState;
