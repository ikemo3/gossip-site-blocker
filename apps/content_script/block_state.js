var BlockReasonType;
(function (BlockReasonType) {
    BlockReasonType[BlockReasonType["URL_EXACTLY"] = 0] = "URL_EXACTLY";
    BlockReasonType[BlockReasonType["URL"] = 1] = "URL";
    BlockReasonType[BlockReasonType["WORD"] = 2] = "WORD";
    BlockReasonType[BlockReasonType["IDN"] = 3] = "IDN";
})(BlockReasonType || (BlockReasonType = {}));
class BlockState {
    constructor(blockable, blockedSites, bannedWords, idnOption) {
        const blockedSite = blockedSites.matches(blockable.getUrl());
        const banned = bannedWords.find((bannedWord) => {
            const keyword = bannedWord.keyword;
            return blockable.contains(keyword);
        });
        if (blockedSite) {
            this.state = blockedSite.getState();
            if (DOMUtils.removeProtocol(blockable.getUrl()) === blockedSite.url) {
                this.blockReason = new BlockReason(BlockReasonType.URL_EXACTLY, blockedSite.url);
            }
            else {
                this.blockReason = new BlockReason(BlockReasonType.URL, blockedSite.url);
            }
            return;
        }
        else if (banned) {
            this.state = banned.blockType.toString();
            this.blockReason = new BlockReason(BlockReasonType.WORD, banned.keyword);
            return;
        }
        // check IDN
        const enabled = idnOption.enabled;
        if (enabled) {
            const url = blockable.getUrl();
            const hostname = DOMUtils.getHostName(url);
            if (hostname.startsWith("xn--") || hostname.includes(".xn--")) {
                this.state = "soft";
                this.blockReason = new BlockReason(BlockReasonType.IDN, chrome.i18n.getMessage("IDN"));
                return;
            }
        }
        this.state = "none";
        this.blockReason = null;
    }
    getReason() {
        return this.blockReason;
    }
    getState() {
        return this.state;
    }
}
//# sourceMappingURL=block_state.js.map