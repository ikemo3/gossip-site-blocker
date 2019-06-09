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
        // FIXME: priority
        if (blockedSite &&
            (!banned || banned.blockType !== BlockType.HARD) &&
            (!regexp || regexp.blockType !== BlockType.HARD)) {
            this.state = blockedSite.getState();
            if (DOMUtils.removeProtocol(blockable.getUrl()) === blockedSite.url) {
                this.blockReason = new BlockReason(BlockReasonType.URL_EXACTLY, blockable.getUrl(), blockedSite.url);
            }
            else {
                this.blockReason = new BlockReason(BlockReasonType.URL, blockable.getUrl(), blockedSite.url);
            }
            return;
        }
        else if (banned) {
            this.state = banned.blockType.toString();
            this.blockReason = new BlockReason(BlockReasonType.WORD, blockable.getUrl(), banned.keyword);
            return;
        }
        else if (regexp) {
            this.state = regexp.blockType.toString();
            this.blockReason = new BlockReason(BlockReasonType.REGEXP, blockable.getUrl(), regexp.pattern);
            return;
        }
        // check IDN
        const enabled = idnOption.enabled;
        if (enabled) {
            const url = blockable.getUrl();
            const hostname = DOMUtils.getHostName(url);
            if (hostname.startsWith("xn--") || hostname.includes(".xn--")) {
                this.state = "soft";
                this.blockReason = new BlockReason(BlockReasonType.IDN, url, $.message("IDN"));
                return;
            }
        }
        this.state = "none";
    }
    getReason() {
        return this.blockReason;
    }
    getState() {
        return this.state;
    }
}
//# sourceMappingURL=block_state.js.map