function blockGoogleElement(g1, options) {
    const g = new GoogleElement(g1);
    if (!g.canBlock()) {
        return false;
    }
    const blockState = new BlockState(g, options.blockedSites, options.bannedWords, options.idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return true;
    }
    const mediator = new BlockMediator(g, blockState, options.defaultBlockType);
    return true;
}
function blockGoogleInnerCard(g1, options) {
    const g = new GoogleInnerCard(g1);
    if (!g.canBlock()) {
        return false;
    }
    const blockState = new BlockState(g, options.blockedSites, options.bannedWords, options.idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return true;
    }
    const mediator = new BlockMediator(g, blockState, options.defaultBlockType);
    mediator.setWrappable("205px");
    return true;
}
//# sourceMappingURL=block_target_factory.js.map