class BlockState {
    public state: string;
    public reason: string;

    constructor(blockable: IBlockable,
                blockedSite: BlockedSite | undefined,
                banned: IBannedWord | undefined,
                idnOption: IAutoBlockIDNOption) {
        if (blockedSite) {
            this.state = blockedSite.getState();
        } else if (banned) {
            this.state = "soft";
        } else {
            this.state = "none";
        }

        this.reason = blockedSite ? blockedSite.url : (banned ? banned.keyword : null);

        // check IDN
        const enabled: boolean = idnOption.enabled;

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
