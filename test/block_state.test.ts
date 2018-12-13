describe("BlockState", () => {
    function createTarget(url: string, contains: boolean) {
        return {
            contains(keyword: string): boolean {
                return contains;
            },

            getUrl(): string {
                return url;
            },
        };
    }

    function createSites(blockType: string, url: string) {
        return {
            matches(urlArg: string): BlockedSite | undefined {
                return new BlockedSite({block_type: blockType, url});
            },
        };
    }

    function createBannedWord(keyword: string, blockType: BlockType) {
        return {
            blockType, keyword,
        };
    }

    const idnOption: IAutoBlockIDNOption = {
        enabled: true,
    };

    it("block by URL", () => {
        const target = createTarget("http://example.com/foo/bar", false);
        const sites = createSites("soft", "example.com");
        const bannedList = [createBannedWord("key", BlockType.SOFT)];

        const blockState = new BlockState(target, sites, bannedList, idnOption);
        expect(blockState.getReason()!.getType()).toBe(BlockType.URL);
        expect(blockState.getReason()!.getWord()).toBe("example.com");
        expect(blockState.getState()).toBe("soft");
    });

    it("block by URL exactly", () => {
        const target = createTarget("http://example.com", false);
        const sites = createSites("soft", "example.com");
        const bannedList = [createBannedWord("key", BlockType.SOFT)];

        const blockState = new BlockState(target, sites, bannedList, idnOption);
        expect(blockState.getReason()!.getType()).toBe(BlockType.URL_EXACTLY);
        expect(blockState.getReason()!.getWord()).toBe("example.com");
        expect(blockState.getState()).toBe("soft");
    });
});
