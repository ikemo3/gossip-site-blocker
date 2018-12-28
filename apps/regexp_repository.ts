interface IRegExpItemList {
    regexpList: IRegExpItem[];
}

interface IRegExpItem {
    pattern: string;
}

const RegExpRepository = {
    async load(): Promise<IRegExpItem[]> {
        const items = await ChromeStorage.get({regexpList: []}) as IRegExpItemList;

        const regexpList = items.regexpList;

        Logger.debug("regexpList: ", regexpList);

        return regexpList;
    },

    async save(items: IRegExpItem[]) {
        await ChromeStorage.set({regexpList: items});
    },

    async clear() {
        await ChromeStorage.set({regexpList: []});
    },

    async add(pattern: string): Promise<boolean> {
        const items: IRegExpItem[] = await this.load();

        for (const item of items) {
            if (pattern === item.pattern) {
                // do nothing.
                return false;
            }
        }

        items.push({pattern});
        await this.save(items);
        return true;
    },

    async delete(deletePattern: string): Promise<boolean> {
        const items: IRegExpItem[] = await this.load();

        const contains = items.find((item) => item.pattern !== deletePattern) !== undefined;
        const filteredPatterns = items.filter((item) => item.pattern !== deletePattern);

        await this.save(filteredPatterns);

        return contains;
    },
};
