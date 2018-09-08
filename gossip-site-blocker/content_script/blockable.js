const BlockTargetFactory = {
    async init() {
        let count = 0;
        const blockedSites = await BlockedSitesRepository.load();
        const bannedWords = await BannedWordRepository.load();
        document.querySelectorAll(".g").forEach(async function (g1) {
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
            /**
             * @type {"none"|"soft"|"hard"}
             */
            let state;
            if (blockedSite) {
                state = blockedSite.getState();
            }
            else if (banned) {
                state = "soft";
            }
            else {
                state = "none";
            }
            const reason = blockedSite ? blockedSite.url : (banned ? banned.keyword : null);
            if (state === "hard") {
                g.deleteElement();
                return;
            }
            const id = `block${++count}`;
            const blockTarget = new BlockTarget(g.getElement(), g.getUrl(), id, state);
            const blockAnchor = new BlockAnchor(id, state, blockTarget, g.getUrl(), reason);
            // insert anchor after target.
            DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
        });
        document.querySelectorAll("g-inner-card").forEach(async function (g1) {
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
            /**
             * @type {"none"|"soft"|"hard"}
             */
            let state;
            if (blockedSite) {
                state = blockedSite.getState();
            }
            else if (banned) {
                state = "soft";
            }
            else {
                state = "none";
            }
            const reason = blockedSite ? blockedSite.url : (banned ? banned.keyword : undefined);
            if (state === "hard") {
                g.deleteElement();
                return;
            }
            const id = `block${++count}`;
            const blockTarget = new BlockTarget(g.getElement(), g.getUrl(), id, state);
            const blockAnchor = new BlockAnchor(id, state, blockTarget, g.getUrl(), reason);
            blockAnchor.setWrappable("205px");
            // insert anchor after target.
            DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
        });
        return this;
    },
};
//# sourceMappingURL=blockable.js.map