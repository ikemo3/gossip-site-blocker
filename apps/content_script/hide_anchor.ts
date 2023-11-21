import { $ } from "../libs/dom";
import { Anchor } from "./block_change_anchor";
import { IBlockMediator } from "./mediator";

export class HideAnchor implements Anchor {
  private readonly anchor: HTMLAnchorElement;

  private readonly mediator: IBlockMediator;

  constructor(mediator: IBlockMediator) {
    this.mediator = mediator;

    const anchor = $.anchor($.message("hideThisPage"));
    $.onclick(anchor, this.mediator.hide.bind(this.mediator));

    this.anchor = anchor;
  }

  public getElement(): Element {
    return this.anchor;
  }

  public show(): void {
    $.showBlock(this.anchor);
  }

  public hide(): void {
    $.hide(this.anchor);
  }
}
export class TemporarilyUnblockAnchor {
  private readonly anchor: HTMLAnchorElement;

  private readonly mediator: IBlockMediator;

  constructor(mediator: IBlockMediator) {
    this.mediator = mediator;

    const anchor = $.anchor();
    anchor.classList.add("blocker-temporarily-unblock");
    $.onclick(anchor, this.mediator.temporarilyUnblock.bind(this.mediator));

    this.anchor = anchor;
  }

  public getElement(): Element {
    return this.anchor;
  }

  public show(reason: string): void {
    $.show(this.anchor);
    $.text(this.anchor, TemporarilyUnblockAnchor.message(reason));
  }

  public hide(): void {
    $.hide(this.anchor);
  }

  private static message(reason: string): string {
    return chrome.i18n.getMessage("temporarilyUnblock", [$.decodeURI(reason)]);
  }
}
