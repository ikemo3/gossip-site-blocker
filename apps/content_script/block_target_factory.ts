interface IBlockable {
    getUrl(): string;

    contains(keyword: string): boolean;

    getElement(): Element;
}

function blockGoogleElement(g1: Element,
                            blockedSites: BlockedSites,
                            bannedWords: IBannedWord[],
                            idnOption: IAutoBlockIDNOption,
                            defaultBlockType: string) {
    const g = new GoogleElement(g1);

    if (!g.canBlock()) {
        return;
    }

    const blockState: BlockState = new BlockState(g, blockedSites, bannedWords, idnOption);

    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }

    const mediator = new BlockMediator(g, blockState, defaultBlockType);
}

function blockGoogleInnerCard(g1: Element,
                              blockedSites: BlockedSites,
                              bannedWords: IBannedWord[],
                              idnOption: IAutoBlockIDNOption,
                              defaultBlockType: string) {
    const g = new GoogleInnerCard(g1);

    if (!g.canBlock()) {
        return;
    }

    const blockState: BlockState = new BlockState(g, blockedSites, bannedWords, idnOption);

    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }

    const mediator = new BlockMediator(g, blockState, defaultBlockType);
    mediator.setWrappable("205px");
}

const BlockTargetFactory = {
    async init(blockedSites: BlockedSites,
               bannedWords: IBannedWord[],
               idnOption: IAutoBlockIDNOption,
               defaultBlockType: string) {

        document.querySelectorAll(".g").forEach((g1: Element) => {
            blockGoogleElement(g1, blockedSites, bannedWords, idnOption, defaultBlockType);
        });

        document.querySelectorAll("g-inner-card").forEach((g1) => {
            blockGoogleInnerCard(g1, blockedSites, bannedWords, idnOption, defaultBlockType);
        });

        return this;
    },
};
