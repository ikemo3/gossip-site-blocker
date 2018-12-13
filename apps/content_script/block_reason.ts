class BlockReason {
    private readonly blockType: BlockReasonType;
    private readonly word: string;

    constructor(blockType: BlockReasonType, reason: string) {
        this.blockType = blockType;
        this.word = reason;
    }

    public getWord(): string {
        return this.word;
    }

    public getType(): BlockReasonType {
        return this.blockType;
    }
}
