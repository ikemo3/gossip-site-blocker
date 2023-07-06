import { BlockReason, BlockReasonType } from "../model/block_reason";
import BlockState from "./block_state";
import BlockDialog from "./dialog";
import { $, ApplicationError, DOMUtils } from "../common";
import BlockedSitesRepository from "../storage/blocked_sites";
import { RegExpRepository } from "../storage/regexp_repository";
import { IBasicBlockMediator, IBlockMediator } from "./mediator";
import { BlockType, MenuPositionType } from "../storage/enums";
import { BlockAnchor } from "./block_anchor";
import { HideAnchor, TemporarilyUnblockAnchor } from "./hide_anchor";
import { BlockChangeAnchorDialog } from "./block_change_anchor_dialog";
import { CompactMenu } from "./compact_menu";
import { BlockTargetElement } from "./block_target_element";
import { BlockChangeAnchor } from "./block_change_anchor";

export type BlockMediatorType = {
  getElement: () => Element;
  getUrl: () => string;
  getPosition: () => string;
  getCompactMenuInsertElement: () => Element;
  getCssClass: () => string;
};

export class BlockMediator implements IBasicBlockMediator, IBlockMediator {
  private readonly url: string;

  private blockReason?: BlockReason;

  private readonly blockTarget: BlockTargetElement;

  private readonly operationDiv: HTMLDivElement;

  private readonly hideAnchor: HideAnchor;

  private readonly temporarilyUnblockAnchor: TemporarilyUnblockAnchor;

  private readonly blockAnchor: BlockAnchor;

  private readonly changeAnchor: BlockChangeAnchor;

  private readonly defaultBlockType: string;

  private blockDialog: BlockDialog;

  private changeStateDialog: BlockChangeAnchorDialog;

  constructor(
    g: BlockMediatorType,
    blockState: BlockState,
    defaultBlockType: string,
    menuPosition: MenuPositionType,
  ) {
    const blockTarget = new BlockTargetElement(this, g.getElement());
    g.getElement().setAttribute(
      "data-gsb-menu-position",
      menuPosition.toString(),
    );

    this.operationDiv = $.div("block-anchor");
    this.url = g.getUrl();
    this.blockReason = blockState.getReason();
    this.blockTarget = blockTarget;
    this.blockAnchor = new BlockAnchor(this);
    this.temporarilyUnblockAnchor = new TemporarilyUnblockAnchor(this);
    this.hideAnchor = new HideAnchor(this);
    this.changeAnchor = new BlockChangeAnchor(this);
    this.defaultBlockType = defaultBlockType;

    let compactMenu;
    switch (menuPosition) {
      case MenuPositionType.COMPACT:
        // insert menu after action menu.
        compactMenu = new CompactMenu(
          this.hideAnchor,
          this.blockAnchor,
          this.changeAnchor,
          g.getPosition(),
        );
        DOMUtils.insertAfter(
          g.getCompactMenuInsertElement(),
          compactMenu.getElement(),
        );

        // insert links after block target.
        this.operationDiv.classList.add("block-anchor-tmp-unblock-only");
        this.operationDiv.classList.add(g.getCssClass());
        this.operationDiv.appendChild(
          this.temporarilyUnblockAnchor.getElement(),
        );
        DOMUtils.insertAfter(blockTarget.getDOMElement(), this.operationDiv);

        break;
      case MenuPositionType.DEFAULT:
        // insert links after block target.
        this.operationDiv.appendChild(
          this.temporarilyUnblockAnchor.getElement(),
        );
        this.operationDiv.appendChild(this.hideAnchor.getElement());
        this.operationDiv.appendChild(this.blockAnchor.getElement());
        this.operationDiv.appendChild(this.changeAnchor.getElement());
        this.operationDiv.classList.add(g.getCssClass());
        DOMUtils.insertAfter(blockTarget.getDOMElement(), this.operationDiv);

        break;
      default:
        throw new ApplicationError(`illegal menuPosition:${menuPosition}`);
    }

    const state = blockState.getState();
    switch (state) {
      case "none":
        this.notBlocked();
        break;

      case "soft":
        this.hide();
        break;
      default:
        throw new ApplicationError(`unknown state:${state}`);
    }
  }

  public notBlocked(): void {
    this.blockAnchor.showBlockThisPage();
    this.blockTarget.show();
    this.temporarilyUnblockAnchor.hide();
    this.hideAnchor.hide();
    this.changeAnchor.hide();
  }

  public hide(): void {
    this.blockAnchor.hide();
    this.blockTarget.hide();
    this.temporarilyUnblockAnchor.show(this.blockReason!.getReason());
    this.hideAnchor.hide();
    this.changeAnchor.hide();
  }

  public temporarilyUnblock(): void {
    const type = this.blockReason!.getType();
    switch (type) {
      case BlockReasonType.URL_EXACTLY:
        this.blockAnchor.hide();
        this.changeAnchor.show();
        break;

      case BlockReasonType.URL:
        this.blockAnchor.showBlockExplicitly();
        this.changeAnchor.show();
        break;

      case BlockReasonType.IDN:
      case BlockReasonType.WORD:
      case BlockReasonType.REGEXP:
        this.blockAnchor.showBlockExplicitly();
        this.changeAnchor.hide();
        break;

      default:
        throw new ApplicationError(`illegal type:${type}`);
    }

    this.blockTarget.temporarilyUnblock();
    this.temporarilyUnblockAnchor.hide();
    this.hideAnchor.show();
  }

  public async toHard(url: string): Promise<void> {
    await BlockedSitesRepository.toHard(url);
    this.blockTarget.remove();
    $.removeSelf(this.operationDiv);
  }

  public async unblock(url: string): Promise<void> {
    await BlockedSitesRepository.del(url);
    this.notBlocked();
  }

  public async block(
    isUrl: boolean,
    pattern: string,
    blockType: string,
  ): Promise<void> {
    if (isUrl) {
      await BlockedSitesRepository.add(pattern, blockType);
    } else {
      await RegExpRepository.add(
        pattern,
        blockType === "soft" ? BlockType.SOFT : BlockType.HARD,
      );
    }

    if (blockType === "hard") {
      this.blockTarget.remove();
      $.removeSelf(this.operationDiv);
      return;
    }

    if (DOMUtils.removeProtocol(this.url) === pattern) {
      this.blockReason = new BlockReason(
        BlockReasonType.URL_EXACTLY,
        this.url,
        pattern,
      );
    } else {
      this.blockReason = new BlockReason(
        BlockReasonType.URL,
        this.url,
        pattern,
      );
    }

    this.hide();
  }

  public showChangeStateDialog(): void {
    // show dialog.
    this.changeStateDialog = new BlockChangeAnchorDialog(
      this,
      this.url,
      this.blockReason!.getReason(),
    );
  }

  public showBlockDialog(): void {
    // show dialog.
    this.blockDialog = new BlockDialog(this, this.url, this.defaultBlockType);
  }

  public async blockPage(
    isUrl: boolean,
    pattern: string,
    blockType: string,
  ): Promise<void> {
    await this.block(isUrl, pattern, blockType);
  }
}
