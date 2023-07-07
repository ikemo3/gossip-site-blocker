import { $ } from "../../libs/dom";
import { ApplicationError } from "../../libs/error";
import { Logger } from "../../libs/logger";
import { BannedWordRepository, BannedWord } from "../../storage/banned_words";
import { createSelectOption } from "../../libs/select";
import { BannedTarget, BlockType, KeywordType } from "../../storage/enums";

export function toBlockType(value: string): BlockType {
  switch (value) {
    case "hard":
      return BlockType.HARD;
    case "soft":
    default:
      return BlockType.SOFT;
  }
}

export function toBannedTarget(value: string): BannedTarget {
  switch (value) {
    case "titleOnly":
      return BannedTarget.TITLE_ONLY;
    case "titleAndContents":
    default:
      return BannedTarget.TITLE_AND_CONTENTS;
  }
}

export default class BannedWords {
  private addButton: HTMLInputElement;

  private addText: HTMLInputElement;

  private wordList: HTMLDivElement;

  constructor() {
    this.addButton = document.getElementById(
      "bannedWordAddButton",
    ) as HTMLInputElement;
    this.addText = document.getElementById(
      "bannedWordAddText",
    ) as HTMLInputElement;
    this.wordList = document.getElementById("bannedWordList") as HTMLDivElement;

    this.addButton.addEventListener("click", async () => {
      const word = this.addText.value;
      if (word === "") {
        return;
      }

      const added: boolean = await BannedWordRepository.add(word);
      if (added) {
        Logger.debug("add to Banned Words", word);
        this.createWidget({
          keyword: word,
          blockType: BlockType.SOFT,
          target: BannedTarget.TITLE_AND_CONTENTS,
          keywordType: KeywordType.STRING,
        });
      }

      this.addText.value = "";
    });
  }

  static strToKeywordType(value: string): KeywordType {
    switch (value) {
      case "regexp":
        return KeywordType.REGEXP;
      case "string":
      default:
        return KeywordType.STRING;
    }
  }

  public clear(): void {
    this.wordList.innerHTML = "";
  }

  public async load(): Promise<void> {
    const words: BannedWord[] = await BannedWordRepository.load();
    this.wordList.innerHTML = "";

    for (const word of words) {
      this.createWidget(word);
    }
  }

  private createWidget(word: BannedWord): void {
    const wordDiv: HTMLDivElement = document.createElement("div");

    const input: HTMLInputElement = document.createElement("input");
    input.type = "text";
    input.value = word.keyword;
    input.readOnly = true;
    wordDiv.appendChild(input);

    const deleteButton: HTMLInputElement = $.button(
      $.message("bannedWordDeleteButton"),
    );
    $.onclick(
      deleteButton,
      this.deleteKeyword.bind(this, word.keyword, wordDiv),
    );
    wordDiv.appendChild(deleteButton);

    const typeSelect: HTMLSelectElement = createSelectOption({
      options: [
        {
          value: "soft",
          message: $.message("softBlock"),
        },
        {
          value: "hard",
          message: $.message("hardBlock"),
        },
      ],
      onChange: this.changeType.bind(this, word.keyword),
      selectedValue: word.blockType.toString(),
    });
    wordDiv.appendChild(typeSelect);

    const targetSelect: HTMLSelectElement = createSelectOption({
      options: [
        {
          value: "titleAndContents",
          message: $.message("titleAndContents"),
        },
        {
          value: "titleOnly",
          message: $.message("titleOnly"),
        },
      ],
      onChange: this.changeTarget.bind(this, word.keyword),
      selectedValue: word.target.toString(),
    });
    wordDiv.appendChild(targetSelect);

    const keywordTypeSelect: HTMLSelectElement = createSelectOption({
      options: [
        {
          value: "string",
          message: $.message("string"),
        },
        {
          value: "regexp",
          message: $.message("regexp"),
        },
      ],
      onChange: this.changeKeywordType.bind(this, word.keyword),
      selectedValue: word.keywordType.toString(),
    });
    wordDiv.appendChild(keywordTypeSelect);

    const br = $.br();
    wordDiv.appendChild(br);

    this.wordList.appendChild(wordDiv);
  }

  private async changeType(keyword: string, ev: Event): Promise<void> {
    const typeSelect: HTMLSelectElement = ev.target as HTMLSelectElement;
    const index = typeSelect.selectedIndex;
    const { value } = typeSelect.options[index];

    switch (value) {
      case "soft":
        await BannedWordRepository.changeType(keyword, BlockType.SOFT);
        break;
      case "hard":
        await BannedWordRepository.changeType(keyword, BlockType.HARD);
        break;
      default:
        throw new ApplicationError(`unknown value:${value}`);
    }
  }

  private async changeTarget(keyword: string, ev: Event): Promise<void> {
    const targetSelect: HTMLSelectElement = ev.target as HTMLSelectElement;
    const index = targetSelect.selectedIndex;
    const { value } = targetSelect.options[index];

    switch (value) {
      case "titleAndContents":
        await BannedWordRepository.changeTarget(
          keyword,
          BannedTarget.TITLE_AND_CONTENTS,
        );
        break;
      case "titleOnly":
        await BannedWordRepository.changeTarget(
          keyword,
          BannedTarget.TITLE_ONLY,
        );
        break;
      default:
        throw new ApplicationError(`unknown value:${value}`);
    }
  }

  private async changeKeywordType(keyword: string, ev: Event): Promise<void> {
    const targetSelect: HTMLSelectElement = ev.target as HTMLSelectElement;
    const index = targetSelect.selectedIndex;
    const { value } = targetSelect.options[index];

    switch (value) {
      case "string":
        await BannedWordRepository.changeKeywordType(
          keyword,
          KeywordType.STRING,
        );
        break;
      case "regexp":
        await BannedWordRepository.changeKeywordType(
          keyword,
          KeywordType.REGEXP,
        );
        break;
      default:
        throw new ApplicationError(`unknown value:${value}`);
    }
  }

  private async deleteKeyword(
    keyword: string,
    wordDiv: HTMLDivElement,
  ): Promise<void> {
    await BannedWordRepository.delete(keyword);
    this.wordList.removeChild(wordDiv);
  }
}
