function blockGoogleElement(g1, blockedSites, bannedWords, idnOption, defaultBlockType) {
    const g = new GoogleElement(g1);
    if (!g.canBlock()) {
        return;
    }
    const blockState = new BlockState(g, blockedSites, bannedWords, idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }
    const mediator = new BlockMediator(g, blockState, defaultBlockType);
}
function blockGoogleInnerCard(g1, blockedSites, bannedWords, idnOption, defaultBlockType) {
    const g = new GoogleInnerCard(g1);
    if (!g.canBlock()) {
        return;
    }
    const blockState = new BlockState(g, blockedSites, bannedWords, idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }
    const mediator = new BlockMediator(g, blockState, defaultBlockType);
    mediator.setWrappable("205px");
}
const BlockTargetFactory = {
    async init(blockedSites, bannedWords, idnOption, defaultBlockType) {
        document.querySelectorAll(".g").forEach((g1) => {
            blockGoogleElement(g1, blockedSites, bannedWords, idnOption, defaultBlockType);
        });
        document.querySelectorAll("g-inner-card").forEach((g1) => {
            blockGoogleInnerCard(g1, blockedSites, bannedWords, idnOption, defaultBlockType);
        });
        return this;
    },
};
//# sourceMappingURL=block_target_factory.js.map