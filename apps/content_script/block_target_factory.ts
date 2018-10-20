interface IBlockable {
    getUrl(): string;

    contains(keyword: string): boolean;

    getElement(): Element;
}

function blockGoogleElement(g1: Element,
                            blockedSites: BlockedSites,
                            bannedWords: IBannedWord[],
                            idnOption: IAutoBlockIDNOption,
                            defaultBlockType: string,
                            id: string) {
    const g = new GoogleElement(g1);

    if (!g.canBlock()) {
        return;
    }

    const blockState: BlockState = new BlockState(g, blockedSites, bannedWords, idnOption);

    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }

    const mediator = new BlockMediator(g, blockState, id, defaultBlockType);
}

function blockGoogleInnerCard(g1: Element,
                              blockedSites: BlockedSites,
                              bannedWords: IBannedWord[],
                              idnOption: IAutoBlockIDNOption,
                              defaultBlockType: string,
                              id: string) {
    const g = new GoogleInnerCard(g1);

    if (!g.canBlock()) {
        return;
    }

    const blockState: BlockState = new BlockState(g, blockedSites, bannedWords, idnOption);

    if (blockState.getState() === "hard") {
        g.deleteElement();
        return;
    }

    const mediator = new BlockMediator(g, blockState, id, defaultBlockType);
    mediator.setWrappable("205px");
}

const BlockTargetFactory = {
    async init(blockedSites: BlockedSites,
               bannedWords: IBannedWord[],
               idnOption: IAutoBlockIDNOption,
               defaultBlockType: string) {
        let count = 0;

        document.querySelectorAll(".g").forEach((g1: Element) => {
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
