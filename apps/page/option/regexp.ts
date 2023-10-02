import { RegExpItem, RegExpRepository } from "../../storage/regexp_repository";
import { $ } from "../../libs/dom";
import { ApplicationError } from "../../libs/error";
import { BlockType } from "../../storage/enums";

class RegExpList {
  private readonly regexpList;

  private readonly addText;

  private readonly addButton;

  constructor() {
    this.regexpList = document.getElementById("regexpList");
    this.addText = document.getElementById("regexpAddText");
    this.addButton = document.getElementById("regexpAddButton");
    if (this.addButton instanceof HTMLInputElement) {
      $.onclick(this.addButton, this.addItem.bind(this));
    }
  }

  public async load(): Promise<void> {
    const patternList = await RegExpRepository.load();
    for (const pattern of patternList) {
      const itemDiv = this.createItem(pattern);
      this.regexpList?.appendChild(itemDiv);
    }
  }

  public clear(): void {
    if (this.regexpList instanceof HTMLDivElement) {
      this.regexpList.innerHTML = "";
    }
  }

  private createItem(item: RegExpItem): HTMLDivElement {
    const div = $.div();
    const input = $.textField(item.pattern);
    input.readOnly = true;

    const delButton = $.button($.message("regexpDeleteButton"));
    $.onclick(delButton, this.deleteItem.bind(this, item.pattern, div));

    const typeSelect = document.createElement("select");
    const softOption = $.option("soft", $.message("softBlock"));
    const hardOption = $.option("hard", $.message("hardBlock"));
    typeSelect.appendChild(softOption);
    typeSelect.appendChild(hardOption);
    typeSelect.addEventListener(
      "change",
      this.changeType.bind(this, item.pattern),
    );
    typeSelect.value = item.blockType.toString();

    div.appendChild(input);
    div.appendChild(delButton);
    div.appendChild(typeSelect);

    return div;
  }

  private async addItem(): Promise<void> {
    if (this.addText instanceof HTMLInputElement) {
      const pattern = this.addText.value;
      if (pattern === "") {
        return;
      }

      const regexp = $.regexp(pattern);
      if (regexp === null) {
        // eslint-disable-next-line no-alert
        alert($.message("invalidPattern"));
        return;
      }

      const added = await RegExpRepository.add(pattern);
      if (added) {
        // add item
        const item = await this.createItem({
          pattern,
          blockType: BlockType.SOFT,
        });
        this.regexpList?.appendChild(item);
      }

      // clear text
      this.addText.value = "";
    }
  }

  private async changeType(pattern: string, ev: Event): Promise<void> {
    const typeSelect = ev.target;
    if (typeSelect instanceof HTMLSelectElement) {
      const index = typeSelect.selectedIndex;
      const { value } = typeSelect.options[index];

      switch (value) {
        case "soft":
          await RegExpRepository.changeType(pattern, BlockType.SOFT);
          break;
        case "hard":
          await RegExpRepository.changeType(pattern, BlockType.HARD);
          break;
        default:
          throw new ApplicationError(`unknown value:${value}`);
      }
    }
  }

  private async deleteItem(
    pattern: string,
    div: HTMLDivElement,
  ): Promise<void> {
    await RegExpRepository.delete(pattern);

    $.removeSelf(div);
  }
}

export default RegExpList;
