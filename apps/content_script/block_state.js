var BlockReasonType;
(function (BlockReasonType) {
    BlockReasonType[BlockReasonType["URL_EXACTLY"] = 0] = "URL_EXACTLY";
    BlockReasonType[BlockReasonType["URL"] = 1] = "URL";
    BlockReasonType[BlockReasonType["WORD"] = 2] = "WORD";
    BlockReasonType[BlockReasonType["REGEXP"] = 3] = "REGEXP";
    BlockReasonType[BlockReasonType["IDN"] = 4] = "IDN";
})(BlockReasonType || (BlockReasonType = {}));
class BlockState {
    constructor(blockable, blockedSites, bannedWords, regexpList, idnOption) {
        const blockedSite = blockedSites.matches(blockable.getUrl());
        const banned = bannedWords.find((bannedWord) => {
            const keyword = bannedWord.keyword;
            switch (bannedWord.target) {
                case BannedTarget.TITLE_ONLY:
                    return blockable.containsInTitle(keyword);
                case BannedTarget.TITLE_AND_CONTENTS:
                default:
                    return blockable.contains(keyword);
            }
        });
        const regexp = regexpList.find((regexpItem) => {
            const pattern = new RegExp(regexpItem.pattern);
            return pattern.test(DOMUtils.removeProtocol(blockable.getUrl()));
        });
        if (blockedSite && (!banned || banned.blockType !== BlockType.HARD) && (!regexp)) {
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
        else if (regexp) {
            this.state = "soft";
            this.blockReason = new BlockReason(BlockReasonType.REGEXP, regexp.pattern);
            return;
        }
        // check IDN
        const enabled = idnOption.enabled;
        if (enabled) {
            const url = blockable.getUrl();
            const hostname = DOMUtils.getHostName(url);
            if (hostname.startsWith("xn--") || hostname.includes(".xn--")) {
                this.state = "soft";
                this.blockReason = new BlockReason(BlockReasonType.IDN, $.message("IDN"));
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