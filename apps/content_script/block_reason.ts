class BlockReason {
    private readonly blockType: BlockType;
    private readonly word: string;

    constructor(blockType: BlockType, reason: string) {
        this.blockType = blockType;
        this.word = reason;
    }

    public getWord(): string {
        return this.word;
    }
}
