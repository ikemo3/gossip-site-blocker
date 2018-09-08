const BannedWordRepository = {
    async load() {
        const items = await ChromeStorage.get({ bannedWords: [] });
        return items.bannedWords;
    },
    async save(words) {
        await ChromeStorage.set({ bannedWords: words });
    },
    async add(addWord) {
        const words = await this.load();
        for (const word of words) {
            if (addWord === word.keyword) {
                // do nothing.
                return false;
            }
        }
        words.push({ keyword: addWord });
        await this.save(words);
        return true;
    },
    async delete(deleteWord) {
        const words = await this.load();
        const contains = words.find((word) => word.keyword !== deleteWord) !== undefined;
        const filteredWords = words.filter((word) => word.keyword !== deleteWord);
        await this.save(filteredWords);
        return contains;
    },
};
//# sourceMappingURL=banned_word_repository.js.map