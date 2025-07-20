import { $ } from "../libs/dom";
import { Anchor } from "./block_change_anchor";

export class CompactMenu {
  private readonly operationSpan: HTMLSpanElement;

  private readonly iconAnchor: HTMLAnchorElement;

  private isShow: boolean;

  private readonly div: HTMLDivElement;

  private readonly parent: HTMLElement;

  constructor(
    hideAnchor: Anchor,
    blockAnchor: Anchor,
    changeAnchor: Anchor,
    position: string,
  ) {
    this.operationSpan = $.span("", "block-anchor");
    this.operationSpan.classList.add("gsb-compact-menu-block-anchor");

    // add icon
    this.iconAnchor = $.anchor("");
    this.iconAnchor.style.position = "relative";
    const iconUrl = chrome.runtime.getURL("icons/icon-12.png");
    const iconImg: HTMLImageElement = document.createElement("img");
    iconImg.src = iconUrl;
    iconImg.classList.add("gsb-compact-menu-icon");
    this.operationSpan.appendChild(this.iconAnchor);
    this.iconAnchor.appendChild(iconImg);
    $.onclick(this.iconAnchor, this.showOperations.bind(this));

    const div = $.div("block-operations-div");
    div.style.position = position;
    div.appendChild(hideAnchor.getElement());
    div.appendChild(blockAnchor.getElement());
    div.appendChild(changeAnchor.getElement());
    this.div = div;

    this.isShow = false;

    // FIXME: ad hoc
    if (position === "absolute") {
      this.parent = this.iconAnchor;
    } else {
      this.parent = this.operationSpan;
    }
  }

  public getElement(): Element {
    return this.operationSpan;
  }

  private showOperations(): void {
    this.isShow = !this.isShow;

    if (this.isShow) {
      this.parent.appendChild(this.div);
    } else {
      this.parent.removeChild(this.div);
    }
  }
}
