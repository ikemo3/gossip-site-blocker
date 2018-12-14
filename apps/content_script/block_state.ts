enum BlockReasonType {
    URL_EXACTLY,
    URL,
    WORD, /* Banned Word */
    IDN, /* Internationalized Domain Name */
}

class BlockState {
    private readonly state: string;
    private readonly blockReason: BlockReason | null;

    constructor(blockable: IBlockTarget,
                blockedSites: IBlockedSites,
                bannedWords: IBannedWord[],
                idnOption: IAutoBlockIDNOption) {

        const blockedSite: BlockedSite | undefined = blockedSites.matches(blockable.getUrl());

        const banned: IBannedWord | undefined = bannedWords.find((bannedWord) => {
            const keyword = bannedWord.keyword;
            return blockable.contains(keyword);
        });

        if (blockedSite && (!banned || banned.blockType !== BlockType.HARD)) {
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
