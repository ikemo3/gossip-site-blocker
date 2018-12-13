describe("BlockState", () => {
    function createTarget(url, contains) {
        return {
            contains(keyword) {
                return contains;
            },
            getUrl() {
                return url;
            },
        };
    }
    function createSites(blockType, url) {
        return {
            matches(urlArg) {
                return new BlockedSite({ block_type: blockType, url });
            },
        };
    }
    function createBannedWord(keyword, blockType) {
        return {
            blockType, keyword,
        };
    }
    const idnOption = {
        enabled: true,
    };
    it("block by URL", () => {
        const target = createTarget("http://example.com/foo/bar", false);
        const sites = createSites("soft", "example.com");
        const bannedList = [createBannedWord("key", BlockType.SOFT)];
        const blockState = new BlockState(target, sites, bannedList, idnOption);
        expect(blockState.getReason().getType()).toBe(BlockType.URL);
        expect(blockState.getReason().getWord()).toBe("example.com");
        expect(blockState.getState()).toBe("soft");
    });
    it("block by URL exactly", () => {
        const target = createTarget("http://example.com", false);
        const sites = createSites("soft", "example.com");
        const bannedList = [createBannedWord("key", BlockType.SOFT)];
        const blockState = new BlockState(target, sites, bannedList, idnOption);
        expect(blockState.getReason().getType()).toBe(BlockType.URL_EXACTLY);
        expect(blockState.getReason().getWord()).toBe("example.com");
        expect(blockState.getState()).toBe("soft");
    });
});
//# sourceMappingURL=block_state.test.js.map