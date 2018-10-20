function blockGoogleElement(g1, options) {
    const g = new GoogleElement(g1);
    if (!g.canBlock()) {
        return;
    }
    const blockState = new BlockState(g, options.blockedSites, options.bannedWords, options.idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }
    const mediator = new BlockMediator(g, blockState, options.defaultBlockType);
}
function blockGoogleInnerCard(g1, options) {
    const g = new GoogleInnerCard(g1);
    if (!g.canBlock()) {
        return;
    }
    const blockState = new BlockState(g, options.blockedSites, options.bannedWords, options.idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }
    const mediator = new BlockMediator(g, blockState, options.defaultBlockType);
    mediator.setWrappable("205px");
}
//# sourceMappingURL=block_target_factory.js.map