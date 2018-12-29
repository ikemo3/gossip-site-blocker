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
    async addAll(regexpList) {
        const items = await this.load();
        for (const regexp of regexpList) {
            let found = false;
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