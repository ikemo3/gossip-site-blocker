describe("BlockState", () => {
    function createTarget(url, contains) {
        return {
            contains(keyword) {
                return contains;
            },
            containsInTitle(keyword) {
                return false;
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
    function createBannedWord(keyword, blockType, target) {
        return {
            blockType, keyword, target,
        };
    }
    function createRegexp(pattern, blockType) {
        return {
            pattern, blockType
        };
    }
    const idnOption = {
        enabled: true,
    };
    it("not blocked", () => {
        const target = createTarget("http://example.com/foo/bar", false);
        const sites = createEmptySites();
        const blockState = new BlockState(target, sites, [], [], idnOption);
        expect(blockState.getReason()).toBeNull();
        expect(blockState.getState()).toBe("none");
    });
    it("block by URL", () => {
        const target = createTarget("http://example.com/foo/bar", false);
        const sites = createSites("soft", "example.com");
        const blockState = new BlockState(target, sites, [], [], idnOption);
        expect(blockState.getReason().getType()).toBe(BlockReasonType.URL);
        expect(blockState.getReason().getReason()).toBe("example.com");
        expect(blockState.getState()).toBe("soft");
    });
    it("block by URL exactly", () => {
        const target = createTarget("http://example.com", false);
        const sites = createSites("soft", "example.com");
        const blockState = new BlockState(target, sites, [], [], idnOption);
        expect(blockState.getReason().getType()).toBe(BlockReasonType.URL_EXACTLY);
        expect(blockState.getReason().getReason()).toBe("example.com");
        expect(blockState.getState()).toBe("soft");
    });
    it("block by word", () => {
        const target = createTarget("http://example.com", true);
        const bannedList = [createBannedWord("evil", BlockType.SOFT, BannedTarget.TITLE_AND_CONTENTS)];
        const blockState = new BlockState(target, createEmptySites(), bannedList, [], idnOption);
        expect(blockState.getReason().getType()).toBe(BlockReasonType.WORD);
        expect(blockState.getReason().getReason()).toBe("evil");
        expect(blockState.getState()).toBe("soft");
    });
    it("block by regexp", () => {
        const target = createTarget("http://example.com", true);
        const regexpList = [createRegexp("example\\..*", BlockType.SOFT)];
        const blockState = new BlockState(target, createEmptySites(), [], regexpList, idnOption);
        expect(blockState.getReason().getType()).toBe(BlockReasonType.REGEXP);
        expect(blockState.getReason().getReason()).toBe("example\\..*");
        expect(blockState.getState()).toBe("soft");
    });
    it("block by URL(exactly) vs word(hard block) => word(hard block)", () => {
        const target = createTarget("http://example.com", true);
        const sites = createSites("soft", "example.com");
        const bannedList = [createBannedWord("evil", BlockType.HARD, BannedTarget.TITLE_AND_CONTENTS)];
        const blockState = new BlockState(target, sites, bannedList, [], idnOption);
        expect(blockState.getReason().getType()).toBe(BlockReasonType.WORD);
        expect(blockState.getReason().getReason()).toBe("evil");
        expect(blockState.getState()).toBe("hard");
    });
    it("block by IDN", () => {
        spyOn($, "message").withArgs("IDN").and.returnValue("Internationalized Domain Name");
        const target = createTarget("http://xn--eckwd4c7cu47r2wf.jp", false);
        const blockState = new BlockState(target, createEmptySites(), [], [], idnOption);
        expect(blockState.getReason().getType()).toBe(BlockReasonType.IDN);
        expect(blockState.getReason().getReason()).toBe("Internationalized Domain Name");
        expect(blockState.getState()).toBe("soft");
    });
});
//# sourceMappingURL=block_state.test.js.map