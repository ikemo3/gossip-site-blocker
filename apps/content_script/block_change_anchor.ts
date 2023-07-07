import { $ } from "../libs/dom";
import { IBlockMediator } from "./mediator";

export interface Anchor {
  getElement(): Element;
}

export class BlockChangeAnchor implements Anchor {
  private readonly mediator: IBlockMediator;

  private readonly anchor: HTMLAnchorElement;

  constructor(mediator: IBlockMediator) {
    this.mediator = mediator;

    const anchor = $.anchor($.message("changeBlockState"));
    $.onclick(anchor, this.mediator.showChangeStateDialog.bind(this.mediator));

    this.anchor = anchor;
  }

  public getElement(): Element {
    return this.anchor;
  }

  public hide(): void {
    $.hide(this.anchor);
  }

  public show(): void {
    $.showBlock(this.anchor);
  }
}
