class BlockState {
    constructor(blockable, blockedSite, banned, idnOption) {
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
        // check IDN
        const enabled = idnOption.enabled;
        if (enabled) {
            const url = blockable.getUrl();
            const hostname = DOMUtils.getHostName(url);
            if (hostname.startsWith("xn--") || hostname.includes(".xn--")) {
                if (this.state === "none") {
                    this.state = "soft";
                    this.reason = chrome.i18n.getMessage("IDN");
                }
            }
        }
    }
}
//# sourceMappingURL=block_state.js.map