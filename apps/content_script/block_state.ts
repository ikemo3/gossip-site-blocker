enum BlockReasonType {
    URL_EXACTLY,
    URL,
    WORD, /* Banned Word */
    REGEXP, /* Regular Expression */
    IDN, /* Internationalized Domain Name */
}

class BlockState {
    private readonly state: string;
    private readonly blockReason: BlockReason | null;

    constructor(blockable: IBlockTarget,
                blockedSites: IBlockedSites,
                bannedWords: IBannedWord[],
                regexpList: IRegExpItem[],
                idnOption: IAutoBlockIDNOption) {

        const blockedSite: BlockedSite | undefined = blockedSites.matches(blockable.getUrl());

        const banned: IBannedWord | undefined = bannedWords.find((bannedWord) => {
            const keyword = bannedWord.keyword;

            switch (bannedWord.target) {
                case BannedTarget.TITLE_ONLY:
                    return blockable.containsInTitle(keyword);

                case BannedTarget.TITLE_AND_CONTENTS:
                default:
                    return blockable.contains(keyword);
            }
        });

        const regexp: IRegExpItem | undefined = regexpList.find((regexpItem) => {
            const pattern = new RegExp(regexpItem.pattern);

            return pattern.test(DOMUtils.removeProtocol(blockable.getUrl()));
        });

        if (blockedSite && (!banned || banned.blockType !== BlockType.HARD) && (!regexp)) {
            this.state = blockedSite.getState();

            if (DOMUtils.removeProtocol(blockable.getUrl()) === blockedSite.url) {
                this.blockReason = new BlockReason(BlockReasonType.URL_EXACTLY, blockedSite.url);
            } else {
                this.blockReason = new BlockReason(BlockReasonType.URL, blockedSite.url);
            }

            return;
        } else if (banned) {
            this.state = banned.blockType.toString();
            this.blockReason = new BlockReason(BlockReasonType.WORD, banned.keyword);
            return;
        } else if (regexp) {
            this.state = "soft";
            this.blockReason = new BlockReason(BlockReasonType.REGEXP, regexp.pattern);
            return;
        }

        // check IDN
        const enabled: boolean = idnOption.enabled;

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

    public getReason(): BlockReason | null {
        return this.blockReason;
    }

    public getState(): string {
        return this.state;
    }
}
