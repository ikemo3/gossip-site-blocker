const BlockTargetFactory = {
    async init() {
        let count = 0;
        const blockedSites = await BlockedSitesRepository.load();
        const bannedWords = await BannedWordRepository.load();
        document.querySelectorAll(".g").forEach(async (g1) => {
            const g = new GoogleElement(g1);
            if (!g.canBlock()) {
                return;
            }
            /**
             * @type {BlockedSite|undefined}
             */
            const blockedSite = blockedSites.matches(g.getUrl());
            const banned = bannedWords.find((bannedWord) => {
                const keyword = bannedWord.keyword;
                return g.contains(keyword);
            });
            const blockState = new BlockState(blockedSite, banned);
            if (blockState.state === "hard") {
                g.deleteElement();
                return;
            }
            const id = `block${++count}`;
            const blockTarget = new BlockTarget(g.getElement(), g.getUrl(), id, blockState.state);
            const blockAnchor = new BlockAnchor(id, blockState.state, blockTarget, g.getUrl(), blockState.reason);
            // insert anchor after target.
            DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
        });
        document.querySelectorAll("g-inner-card").forEach(async (g1) => {
            const g = new GoogleInnerCard(g1);
            if (!g.canBlock()) {
                return;
            }
            /**
             * @type {BlockedSite|undefined}
             */
            const blockedSite = blockedSites.matches(g.getUrl());
            const banned = bannedWords.find((bannedWord) => {
                const keyword = bannedWord.keyword;
                return g.contains(keyword);
            });
            const blockState = new BlockState(blockedSite, banned);
            if (blockState.state === "hard") {
                g.deleteElement();
                return;
            }
            const id = `block${++count}`;
            const blockTarget = new BlockTarget(g.getElement(), g.getUrl(), id, blockState.state);
            const blockAnchor = new BlockAnchor(id, blockState.state, blockTarget, g.getUrl(), blockState.reason);
            blockAnchor.setWrappable("205px");
            // insert anchor after target.
            DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
        });
        return this;
    },
};
//# sourceMappingURL=blockable.js.map