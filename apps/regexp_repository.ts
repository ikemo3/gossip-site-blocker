interface IRegExpItemList {
    regexpList: IRegExpItem[];
}

interface IRegExpItem {
    pattern: string;
    blockType: BlockType;
}

const RegExpRepository = {
    async load(): Promise<IRegExpItem[]> {
        const items = await ChromeStorage.get({regexpList: []}) as IRegExpItemList;

        const itemsCopy = items.regexpList;

        for (const item of itemsCopy) {
            if (!item.blockType) {
                item.blockType = BlockType.SOFT;
            }
        }

        Logger.debug("regexpList: ", itemsCopy);

        return itemsCopy;
    },

    async save(items: IRegExpItem[]) {
        await ChromeStorage.set({regexpList: items});
    },

    async clear() {
        await ChromeStorage.set({regexpList: []});
    },

    async addAll(regexpList: IRegExpItem[]): Promise<void> {
        const items: IRegExpItem[] = await this.load();

        for (const regexp of regexpList) {
            let found: boolean = false;
            for (const item of items) {
                if (regexp.pattern === item.pattern) {
                    // do nothing.
                    found = true;
                }
            }

            if (!found) {
                items.push(regexp);
            }
        }

        await this.save(items);
    },

    async add(pattern: string): Promise<boolean> {
        const items: IRegExpItem[] = await this.load();

        for (const item of items) {
            if (pattern === item.pattern) {
                // do nothing.
                return false;
            }
        }

        items.push({pattern, blockType: BlockType.SOFT});
        await this.save(items);
        return true;
    },

    async changeType(pattern: string, type: BlockType): Promise<void> {
        const items: IRegExpItem[] = await this.load();

        const filteredItems = items.map((item) => {
            if (item.pattern !== pattern) {
                return item;
            }

            item.blockType = type;
            return item;
        });

        await this.save(filteredItems);
    },

    async delete(deletePattern: string): Promise<boolean> {
        const items: IRegExpItem[] = await this.load();

        const contains = items.find((item) => item.pattern !== deletePattern) !== undefined;
        const filteredPatterns = items.filter((item) => item.pattern !== deletePattern);

        await this.save(filteredPatterns);

        return contains;
    },
};
