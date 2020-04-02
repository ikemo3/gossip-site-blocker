import { BlockReason, BlockReasonType } from '../model/block_reason';
import BlockState from './block_state';
import BlockDialog from './dialog';
import { SearchResultToBlock } from '../block/block';
import {
    $, ApplicationError, BlockType, DOMUtils, MenuPosition,
} from '../common';
import BlockedSitesRepository from '../repository/blocked_sites';
import { RegExpRepository } from '../repository/regexp_repository';
import { IBasicBlockMediator, IBlockMediator } from './mediator';

/**
 * Block target element.
 */
class BlockTargetElement {
    private readonly mediator: BlockMediator;

    private readonly element: Element;

    constructor(mediator: BlockMediator, element: Element) {
        this.mediator = mediator;
        this.element = element;
    }

    public remove(): void {
        $.removeSelf(this.element);
    }

    public getDOMElement(): Element {
        return this.element;
    }

    public show(): void {
        this.element.removeAttribute('data-blocker-display');
    }

    public hide(): void {
        this.element.setAttribute('data-blocker-display', 'none');
    }

    public temporarilyUnblock(): void {
        this.element.setAttribute('data-blocker-display', 'unhide');
    }
}

interface Anchor {
    getElement(): Element;
}

class HideAnchor implements Anchor {
    private readonly anchor: HTMLAnchorElement;

    private readonly mediator: IBlockMediator;

    constructor(mediator: IBlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor($.message('hideThisPage'));
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

class TemporarilyUnblockAnchor {
    private readonly anchor: HTMLAnchorElement;

    private readonly mediator: BlockMediator;

    constructor(mediator: BlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor();
        anchor.classList.add('blocker-temporarily-unblock');
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
        return chrome.i18n.getMessage('temporarilyUnblock', [$.decodeURI(reason)]);
    }
}

class BlockAnchor implements Anchor {
    private readonly anchor: HTMLAnchorElement;

    private readonly mediator: IBlockMediator;

    constructor(mediator: IBlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor($.message('blockThisPage'));
        $.onclick(anchor, this.mediator.showBlockDialog.bind(this.mediator));

        this.anchor = anchor;
    }

    public getElement(): Element {
        return this.anchor;
    }

    public showBlockThisPage(): void {
        $.showBlock(this.anchor);
        $.text(this.anchor, $.message('blockThisPage'));
    }

    public showBlockExplicitly(): void {
        $.showBlock(this.anchor);
        $.text(this.anchor, $.message('blockThisPageExplicitly'));
    }

    public hide(): void {
        $.hide(this.anchor);
    }
}

class BlockChangeAnchor implements Anchor {
    private readonly mediator: IBlockMediator;

    private readonly anchor: HTMLAnchorElement;

    constructor(mediator: IBlockMediator) {
        this.mediator = mediator;

        const anchor = $.anchor($.message('changeBlockState'));
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

class BlockChangeAnchorDialog {
    private readonly mediator: BlockMediator;

    private readonly background: HTMLDivElement;

    private readonly reason: string | null;

    private readonly url: string;

    constructor(mediator: BlockMediator, url: string, reason: string | null) {
        this.mediator = mediator;
        this.url = url;

        const background = $.div('block-dialog-background');
        this.background = background;

        const dialog = $.div('block-dialog');
        const explanation = $.message('blockChangeExplanation');
        const explanationDiv = $.div();
        explanationDiv.textContent = explanation;

        const reasonDiv = $.div();
        reasonDiv.textContent = `URL: ${reason}`;

        dialog.appendChild(explanationDiv);
        dialog.appendChild(reasonDiv);

        const buttonsDiv = $.div('block-dialog-buttons');

        const cancelButton = $.button($.message('cancelButtonLabel'), 'blocker-secondary-button');
        $.onclick(cancelButton, this.cancel.bind(this));

        const unblockButton = $.button($.message('unblock'), 'blocker-secondary-button');
        $.onclick(unblockButton, this.unblock.bind(this));

        const hardBlockButton = $.button($.message('hardBlock'), 'blocker-secondary-button');
        $.onclick(hardBlockButton, this.toHard.bind(this));

        document.body.appendChild(background);
        background.appendChild(dialog);
        dialog.appendChild(buttonsDiv);
        buttonsDiv.appendChild(cancelButton);
        buttonsDiv.appendChild(unblockButton);
        buttonsDiv.appendChild(hardBlockButton);

        this.reason = reason;
    }

    private cancel(): void {
        this.closeDialog();
    }

    private async toHard(): Promise<void> {
        await this.mediator.toHard(this.reason!);
        this.closeDialog();
    }

    private async unblock(): Promise<void> {
        await this.mediator.unblock(this.reason!);
        this.closeDialog();
    }

    private closeDialog(): void {
        // remove background
        $.removeSelf(this.background);
    }
}

class CompactMenu {
    private readonly operationSpan: HTMLSpanElement;

    private readonly iconAnchor: HTMLAnchorElement;

    private isShow: boolean;

    private readonly div: HTMLDivElement;

    private readonly parent: HTMLElement;

    constructor(hideAnchor: Anchor, blockAnchor: Anchor, changeAnchor: Anchor, position: string) {
        this.operationSpan = $.span('', 'block-anchor');

        // add icon
        this.iconAnchor = $.anchor('');
        this.iconAnchor.style.position = 'relative';
        const iconUrl = chrome.runtime.getURL('icons/icon-12.png');
        const iconImg: HTMLImageElement = document.createElement('img');
        iconImg.src = iconUrl;
        this.operationSpan.appendChild(this.iconAnchor);
        this.iconAnchor.appendChild(iconImg);
        $.onclick(this.iconAnchor, this.showOperations.bind(this));

        const div = $.div('block-operations-div');
        div.style.position = position;
        div.appendChild(hideAnchor.getElement());
        div.appendChild(blockAnchor.getElement());
        div.appendChild(changeAnchor.getElement());
        this.div = div;

        this.isShow = false;

        // FIXME: ad hoc
        if (position === 'absolute') {
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

class BlockMediator implements IBasicBlockMediator, IBlockMediator {
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

    constructor(g: SearchResultToBlock, blockState: BlockState, defaultBlockType: string,
        menuPosition: MenuPosition) {
        const blockTarget = new BlockTargetElement(this, g.getElement());

        this.operationDiv = $.div('block-anchor');
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
        case MenuPosition.COMPACT:
            // insert menu after action menu.
            compactMenu = new CompactMenu(this.hideAnchor, this.blockAnchor, this.changeAnchor,
                g.getPosition());
            DOMUtils.insertAfter(g.getCompactMenuInsertElement(), compactMenu.getElement());

            // insert links after block target.
            this.operationDiv.classList.add('block-anchor-tmp-unblock-only');
            this.operationDiv.classList.add(g.getCssClass());
            this.operationDiv.appendChild(this.temporarilyUnblockAnchor.getElement());
            DOMUtils.insertAfter(blockTarget.getDOMElement(), this.operationDiv);

            break;
        case MenuPosition.DEFAULT:
            // insert links after block target.
            this.operationDiv.appendChild(this.temporarilyUnblockAnchor.getElement());
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
        case 'none':
            this.notBlocked();
            break;

        case 'soft':
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

    public async block(isUrl: boolean, pattern: string, blockType: string): Promise<void> {
        if (isUrl) {
            await BlockedSitesRepository.add(pattern, blockType);
        } else {
            await RegExpRepository.add(pattern, blockType === 'soft' ? BlockType.SOFT : BlockType.HARD);
        }

        if (blockType === 'hard') {
            this.blockTarget.remove();
            $.removeSelf(this.operationDiv);
            return;
        }

        if (DOMUtils.removeProtocol(this.url) === pattern) {
            this.blockReason = new BlockReason(BlockReasonType.URL_EXACTLY, this.url, pattern);
        } else {
            this.blockReason = new BlockReason(BlockReasonType.URL, this.url, pattern);
        }

        this.hide();
    }

    public showChangeStateDialog(): void {
        // show dialog.
        this.changeStateDialog = new BlockChangeAnchorDialog(this, this.url,
            this.blockReason!.getReason());
    }

    public showBlockDialog(): void {
        // show dialog.
        this.blockDialog = new BlockDialog(this, this.url, this.defaultBlockType);
    }

    public async blockPage(isUrl: boolean, pattern: string, blockType: string): Promise<void> {
        await this.block(isUrl, pattern, blockType);
    }
}

export default BlockMediator;
