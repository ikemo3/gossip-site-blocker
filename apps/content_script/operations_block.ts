import { $ } from '../common';
import { HideAnchor } from './hide_anchor';
import { BlockAnchor } from './block_anchor';
import { BlockChangeAnchor } from './block_change_anchor';
import { TemporarilyUnblockAnchor } from './temporarily_unblock_anchor';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class OperationsBlock {
    private readonly operationDiv: HTMLDivElement;

    constructor(temporarilyUnblockAnchor: TemporarilyUnblockAnchor,
        hideAnchor: HideAnchor,
        blockAnchor: BlockAnchor,
        changeAnchor: BlockChangeAnchor) {
        this.operationDiv = $.div('block-anchor');

        this.operationDiv.appendChild(temporarilyUnblockAnchor.getElement());
        this.operationDiv.appendChild(hideAnchor.getElement());
        this.operationDiv.appendChild(blockAnchor.getElement());
        this.operationDiv.appendChild(changeAnchor.getElement());
    }

    public getElement(): Element {
        return this.operationDiv;
    }
}
