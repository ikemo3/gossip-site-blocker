const BannedWordRepository = {
    async load() {
        const items = await ChromeStorage.get({ bannedWords: [] });
        return items.bannedWords;
    },
    async save(words) {
        await ChromeStorage.set({ bannedWords: words });
    },
    async clear() {
        await ChromeStorage.set({ bannedWords: [] });
    },
    async addAll(bannedWordList) {
        const words = await this.load();
        for (const bannedWord of bannedWordList) {
            let found = false;
            for (const word of words) {
                if (bannedWord.keyword === word.keyword) {
                    // do nothing.
                    found = true;
                }
            }
            if (!found) {
                words.push(bannedWord);
            }
        }
        await this.save(words);
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