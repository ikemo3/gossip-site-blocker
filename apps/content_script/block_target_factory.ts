interface IBlockable {
    getUrl(): string;

    contains(keyword: string): boolean;

    getElement(): Element;
}

const BlockTargetFactory = {
    async init(blockedSites: BlockedSites,
               bannedWords: IBannedWord[],
               idnOption: IAutoBlockIDNOption,
               defaultBlockType: string) {
        let count = 0;

        document.querySelectorAll(".g").forEach((g1: Element) => {
            const g = new GoogleElement(g1);

            if (!g.canBlock()) {
                return;
            }

            const blockState: BlockState = new BlockState(g, blockedSites, bannedWords, idnOption);

            if (blockState.getState() === "hard") {
                g.deleteElement();
                return;
            }

            const id = `block${++count}`;
            const mediator = new BlockMediator(g, blockState, id, defaultBlockType);
        });

        document.querySelectorAll("g-inner-card").forEach((g1) => {
            const g = new GoogleInnerCard(g1);

            if (!g.canBlock()) {
                return;
            }

            const blockState: BlockState = new BlockState(g, blockedSites, bannedWords, idnOption);

            if (blockState.getState() === "hard") {
                g.deleteElement();
                return;
            }

            const id = `block${++count}`;
            const mediator = new BlockMediator(g, blockState, id, defaultBlockType);
            mediator.setWrappable("205px");
        });

        return this;
    },
};
