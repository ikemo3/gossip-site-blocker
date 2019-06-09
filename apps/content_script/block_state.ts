enum BlockReasonType {
    URL_EXACTLY,
    URL,
    WORD, /* Banned Word */
    REGEXP, /* Regular Expression */
    IDN, /* Internationalized Domain Name */
}

class BlockState {
    private readonly state: string;
    private readonly blockReason?: BlockReason;

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

        // FIXME: priority
        if (blockedSite &&
            (!banned || banned.blockType !== BlockType.HARD) &&
            (!regexp || regexp.blockType !== BlockType.HARD)) {
            this.state = blockedSite.getState();

            if (DOMUtils.removeProtocol(blockable.getUrl()) === blockedSite.url) {
                this.blockReason = new BlockReason(BlockReasonType.URL_EXACTLY, blockable.getUrl(), blockedSite.url);
            } else {
                this.blockReason = new BlockReason(BlockReasonType.URL, blockable.getUrl(), blockedSite.url);
            }

            return;
        } else if (banned) {
            this.state = banned.blockType.toString();
            this.blockReason = new BlockReason(BlockReasonType.WORD, blockable.getUrl(), banned.keyword);
            return;
        } else if (regexp) {
            this.state = regexp.blockType.toString();
            this.blockReason = new BlockReason(BlockReasonType.REGEXP, blockable.getUrl(), regexp.pattern);
            return;
        }

        // check IDN
        const enabled: boolean = idnOption.enabled;

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

    public getReason(): BlockReason | undefined {
        return this.blockReason;
    }

    public getState(): string {
        return this.state;
    }
}
