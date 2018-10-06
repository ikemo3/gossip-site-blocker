class BlockState {
    constructor(blockedSite, banned) {
        if (blockedSite) {
            this.state = blockedSite.getState();
        }
        else if (banned) {
            this.state = "soft";
        }
        else {
            this.state = "none";
        }
        this.reason = blockedSite ? blockedSite.url : (banned ? banned.keyword : null);
    }
}
//# sourceMappingURL=block_state.js.map