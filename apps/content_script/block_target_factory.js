function blockGoogleElement(g1, options) {
    const g = new GoogleElement(g1);
    if (g.isIgnoreable()) {
        return true;
    }
    if (!g.canBlock()) {
        return false;
    }
    const blockState = new BlockState(g, options.blockedSites, options.bannedWords, options.regexpList, options.idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return true;
    }
    const mediator = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}
function blockGoogleInnerCard(g1, options) {
    const g = new GoogleInnerCard(g1);
    if (!g.canBlock()) {
        return false;
    }
    const blockState = new BlockState(g, options.blockedSites, options.bannedWords, options.regexpList, options.idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return true;
    }
    const mediator = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    mediator.setWrappable("205px");
    return true;
}
function blockGoogleTopNews(g1, options) {
    const g = new GoogleTopNews(g1);
    if (!g.canBlock()) {
        return false;
    }
    const blockState = new BlockState(g, options.blockedSites, options.bannedWords, options.regexpList, options.idnOption);
    if (blockState.getState() === "hard") {
        g.deleteElement();
        return true;
    }
    const mediator = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}
//# sourceMappingURL=block_target_factory.js.map