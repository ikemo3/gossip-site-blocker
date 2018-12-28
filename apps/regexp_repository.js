const RegExpRepository = {
    async load() {
        const items = await ChromeStorage.get({ regexpList: [] });
        const regexpList = items.regexpList;
        Logger.debug("regexpList: ", regexpList);
        return regexpList;
    },
    async save(items) {
        await ChromeStorage.set({ regexpList: items });
    },
    async clear() {
        await ChromeStorage.set({ regexpList: [] });
    },
    async add(pattern) {
        const items = await this.load();
        for (const item of items) {
            if (pattern === item.pattern) {
                // do nothing.
                return false;
            }
        }
        items.push({ pattern });
        await this.save(items);
        return true;
    },
    async delete(deletePattern) {
        const items = await this.load();
        const contains = items.find((item) => item.pattern !== deletePattern) !== undefined;
        const filteredPatterns = items.filter((item) => item.pattern !== deletePattern);
        await this.save(filteredPatterns);
        return contains;
    },
};
//# sourceMappingURL=regexp_repository.js.map