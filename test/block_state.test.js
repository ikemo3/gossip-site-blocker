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
    function createEmptySites() {
        return {
            matches(urlArg) {
                return undefined;
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
    it("not blocked", () => {
        const target = createTarget("http://example.com/foo/bar", false);
        const sites = createEmptySites();
        const blockState = new BlockState(target, sites, [], idnOption);
        expect(blockState.getReason()).toBeNull();
        expect(blockState.getState()).toBe("none");
    });
    it("block by URL", () => {
        const target = createTarget("http://example.com/foo/bar", false);
        const sites = createSites("soft", "example.com");
        const blockState = new BlockState(target, sites, [], idnOption);
        expect(blockState.getReason().getType()).toBe(BlockReasonType.URL);
        expect(blockState.getReason().getWord()).toBe("example.com");
        expect(blockState.getState()).toBe("soft");
    });
    it("block by URL exactly", () => {
        const target = createTarget("http://example.com", false);
        const sites = createSites("soft", "example.com");
        const blockState = new BlockState(target, sites, [], idnOption);
        expect(blockState.getReason().getType()).toBe(BlockReasonType.URL_EXACTLY);
        expect(blockState.getReason().getWord()).toBe("example.com");
        expect(blockState.getState()).toBe("soft");
    });
    it("block by word", () => {
        const target = createTarget("http://example.com", true);
        const bannedList = [createBannedWord("evil", BlockType.SOFT)];
        const blockState = new BlockState(target, createEmptySites(), bannedList, idnOption);
        expect(blockState.getReason().getType()).toBe(BlockReasonType.WORD);
        expect(blockState.getReason().getWord()).toBe("evil");
        expect(blockState.getState()).toBe("soft");
    });
    it("block by IDN", () => {
        spyOn($, "message").withArgs("IDN").and.returnValue("Internationalized Domain Name");
        const target = createTarget("http://xn--eckwd4c7cu47r2wf.jp", false);
        const blockState = new BlockState(target, createEmptySites(), [], idnOption);
        expect(blockState.getReason().getType()).toBe(BlockReasonType.IDN);
        expect(blockState.getReason().getWord()).toBe("Internationalized Domain Name");
        expect(blockState.getState()).toBe("soft");
    });
});
//# sourceMappingURL=block_state.test.js.map