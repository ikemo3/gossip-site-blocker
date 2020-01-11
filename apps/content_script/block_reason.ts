import { BlockReasonType } from './block_state';

export class BlockReason {
    private readonly blockType: BlockReasonType;

    private readonly url: string;

    private readonly reason: string;

    constructor(blockType: BlockReasonType, url: string, reason: string) {
        this.blockType = blockType;
        this.url = url;
        this.reason = reason;
    }

    public getReason(): string {
        return this.reason;
    }

    public getUrl(): string {
        return this.url;
    }

    public getType(): BlockReasonType {
        return this.blockType;
    }
}
