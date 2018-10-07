const BlockTargetFactory = {
    async init() {
        let count = 0;
        const blockedSites = await BlockedSitesRepository.load();
        const bannedWords = await BannedWordRepository.load();
        const idnOption = await OptionRepository.getAutoBlockIDNOption();
        Logger.debug("autoBlockIDNOption:", idnOption);
        document.querySelectorAll(".g").forEach((g1) => {
            const g = new GoogleElement(g1);
            if (!g.canBlock()) {
                return;
            }
            const blockState = new BlockState(g, blockedSites, bannedWords, idnOption);
            if (blockState.state === "hard") {
                g.deleteElement();
                return;
            }
            const id = `block${++count}`;
            const mediator = new BlockMediator(g, blockState, id);
        });
        document.querySelectorAll("g-inner-card").forEach((g1) => {
            const g = new GoogleInnerCard(g1);
            if (!g.canBlock()) {
                return;
            }
            const blockState = new BlockState(g, blockedSites, bannedWords, idnOption);
            if (blockState.state === "hard") {
                g.deleteElement();
                return;
            }
            const id = `block${++count}`;
            const mediator = new BlockMediator(g, blockState, id);
            mediator.setWrappable("205px");
        });
        return this;
    },
};
//# sourceMappingURL=block_target_factory.js.map