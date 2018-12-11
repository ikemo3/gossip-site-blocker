interface IBlockable {
    getUrl(): string;

    canBlock(): boolean;

    contains(keyword: string): boolean;

    deleteElement(): void;

    getElement(): Element;

    getOperationInsertPoint(): Element;

    getPosition(): string;

    getCssClass(): string;
}

function blockGoogleElement(g1: Element, options: IOptions): boolean {
    const g = new GoogleElement(g1);

    if (g.isIgnoreable()) {
        return true;
    }

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords, options.idnOption);

    if (blockState.getState() === "hard") {
        g.deleteElement();
        return true;
    }

    const mediator = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}

function blockGoogleInnerCard(g1: Element, options: IOptions): boolean {
    const g = new GoogleInnerCard(g1);

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords, options.idnOption);

    if (blockState.getState() === "hard") {
        g.deleteElement();
        return true;
    }

    const mediator = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    mediator.setWrappable("205px");
    return true;
}

function blockGoogleTopNews(g1: Element, options: IOptions): boolean {
    const g = new GoogleTopNews(g1);

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords, options.idnOption);

    if (blockState.getState() === "hard") {
        g.deleteElement();
        return true;
    }

    const mediator = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}
