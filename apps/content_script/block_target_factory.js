function blockGoogleElement(g1, blockedSites, bannedWords, idnOption, defaultBlockType, id) {
    const g = new GoogleElement(g1);
    if (!g.canBlock()) {
        return;
    }
    const blockState = new BlockState(g, blockedSites, bannedWords, idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }
    const mediator = new BlockMediator(g, blockState, id, defaultBlockType);
}
function blockGoogleInnerCard(g1, blockedSites, bannedWords, idnOption, defaultBlockType, id) {
    const g = new GoogleInnerCard(g1);
    if (!g.canBlock()) {
        return;
    }
    const blockState = new BlockState(g, blockedSites, bannedWords, idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }
    const mediator = new BlockMediator(g, blockState, id, defaultBlockType);
    mediator.setWrappable("205px");
}
const BlockTargetFactory = {
    async init(blockedSites, bannedWords, idnOption, defaultBlockType) {
        let count = 0;
        document.querySelectorAll(".g").forEach((g1) => {
            const id = `block${++count}`;
            blockGoogleElement(g1, blockedSites, bannedWords, idnOption, defaultBlockType, id);
        });
        document.querySelectorAll("g-inner-card").forEach((g1) => {
            const id = `block${++count}`;
            blockGoogleInnerCard(g1, blockedSites, bannedWords, idnOption, defaultBlockType, id);
        });
        return this;
    },
};
//# sourceMappingURL=block_target_factory.js.map