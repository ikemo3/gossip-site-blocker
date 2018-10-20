interface IBlockable {
    getUrl(): string;

    contains(keyword: string): boolean;

    getElement(): Element;
}

function blockGoogleElement(g1: Element, options: IOptions) {
    const g = new GoogleElement(g1);

    if (!g.canBlock()) {
        return;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords, options.idnOption);

    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }

    const mediator = new BlockMediator(g, blockState, options.defaultBlockType);
}

function blockGoogleInnerCard(g1: Element, options: IOptions) {
    const g = new GoogleInnerCard(g1);

    if (!g.canBlock()) {
        return;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords, options.idnOption);

    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }

    const mediator = new BlockMediator(g, blockState, options.defaultBlockType);
    mediator.setWrappable("205px");
}
