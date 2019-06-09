class BlockReason {
    constructor(blockType, url, reason) {
        this.blockType = blockType;
        this.url = url;
        this.reason = reason;
    }
    getReason() {
        return this.reason || this.url;
    }
    getType() {
        return this.blockType;
    }
}
//# sourceMappingURL=block_reason.js.map