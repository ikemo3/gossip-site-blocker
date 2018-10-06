class BlockState {
    public readonly state: string;
    public readonly reason: string;

    constructor(blockedSite: BlockedSite | undefined, banned: IBannedWord | undefined) {
        if (blockedSite) {
            this.state = blockedSite.getState();
        } else if (banned) {
            this.state = "soft";
        } else {
            this.state = "none";
        }

        this.reason = blockedSite ? blockedSite.url : (banned ? banned.keyword : null);
    }
}
