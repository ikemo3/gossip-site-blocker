/* global BlockMediator, blockReasons, BlockState, GoogleElement, GoogleInnerCard, GoogleTopNews */

interface IBlockTarget {
    getUrl(): string;

    contains(keyword: string): boolean;

    containsInTitle(keyword: string): boolean;
}

interface IBlockable {
    getUrl(): string;

    canBlock(): boolean;

    contains(keyword: string): boolean;

    containsInTitle(keyword: string): boolean;

    deleteElement(): void;

    getElement(): Element;

    getOperationInsertPoint(): Element;

    getPosition(): string;

    getCssClass(): string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function blockGoogleElement(g1: Element, options: IOptions): boolean {
    const g = new GoogleElement(g1);

    if (g.isIgnoreable()) {
        return true;
    }

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords,
        options.regexpList, options.idnOption);

    if (blockState.getReason()) {
        blockReasons.push(blockState.getReason()!);
    }

    if (blockState.getState() === 'hard') {
        g.deleteElement();
        return true;
    }

    const _ = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function blockGoogleInnerCard(g1: Element, options: IOptions): boolean {
    const g = new GoogleInnerCard(g1);

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords,
        options.regexpList, options.idnOption);

    if (blockState.getReason()) {
        blockReasons.push(blockState.getReason()!);
    }

    if (blockState.getState() === 'hard') {
        g.deleteElement();
        return true;
    }

    const mediator = new BlockMediator(g, blockState, options.defaultBlockType,
        options.menuPosition);
    mediator.setWrappable('205px');
    return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function blockGoogleTopNews(g1: Element, options: IOptions): boolean {
    const g = new GoogleTopNews(g1);

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords,
        options.regexpList, options.idnOption);

    if (blockState.getReason()) {
        blockReasons.push(blockState.getReason()!);
    }

    if (blockState.getState() === 'hard') {
        g.deleteElement();
        return true;
    }

    const _ = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}
