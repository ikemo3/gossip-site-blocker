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

    function createEmptySites() {
        return {
            matches(urlArg: string): BlockedSite | undefined {
                return undefined;
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

    function createBannedWord(keyword: string, blockType: BlockType, target: BannedTarget) {
        return {
            blockType, keyword, target,
        };
    }

    const idnOption: IAutoBlockIDNOption = {
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
        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.URL);
        expect(blockState.getReason()!.getWord()).toBe("example.com");
        expect(blockState.getState()).toBe("soft");
    });

    it("block by URL exactly", () => {
        const target = createTarget("http://example.com", false);
        const sites = createSites("soft", "example.com");

        const blockState = new BlockState(target, sites, [], idnOption);
        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.URL_EXACTLY);
        expect(blockState.getReason()!.getWord()).toBe("example.com");
        expect(blockState.getState()).toBe("soft");
    });

    it("block by word", () => {
        const target = createTarget("http://example.com", true);
        const bannedList = [createBannedWord("evil", BlockType.SOFT, BannedTarget.TITLE_AND_CONTENTS)];

        const blockState = new BlockState(target, createEmptySites(), bannedList, idnOption);
        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.WORD);
        expect(blockState.getReason()!.getWord()).toBe("evil");
        expect(blockState.getState()).toBe("soft");
    });

    it("block by URL(exactly) vs word(hard block) => word(hard block)", () => {
        const target = createTarget("http://example.com", true);
        const sites = createSites("soft", "example.com");
        const bannedList = [createBannedWord("evil", BlockType.HARD, BannedTarget.TITLE_AND_CONTENTS)];

        const blockState = new BlockState(target, sites, bannedList, idnOption);
        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.WORD);
        expect(blockState.getReason()!.getWord()).toBe("evil");
        expect(blockState.getState()).toBe("hard");
    });

    it("block by IDN", () => {
        spyOn($, "message").withArgs("IDN").and.returnValue("Internationalized Domain Name");

        const target = createTarget("http://xn--eckwd4c7cu47r2wf.jp", false);

        const blockState = new BlockState(target, createEmptySites(), [], idnOption);
        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.IDN);
        expect(blockState.getReason()!.getWord()).toBe("Internationalized Domain Name");
        expect(blockState.getState()).toBe("soft");
    });
});
