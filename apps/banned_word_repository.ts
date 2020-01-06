/* global BannedTarget, BlockType, ChromeStorage, Logger */

interface IBannedWordItems {
    bannedWords: IBannedWord[];
}

interface IBannedWord {
    keyword: string;
    blockType: BlockType;
    target: BannedTarget;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BannedWordRepository = {
    async load(): Promise<IBannedWord[]> {
        const items = await ChromeStorage.get({ bannedWords: [] }) as IBannedWordItems;

        const itemsCopy = items.bannedWords;
        for (const item of itemsCopy) {
            if (!item.blockType) {
                item.blockType = BlockType.SOFT;
            }

            if (!item.target) {
                item.target = BannedTarget.TITLE_AND_CONTENTS;
            }
        }

        Logger.debug('bannedWords: ', itemsCopy);

        return itemsCopy;
    },

    async save(words: IBannedWord[]): Promise<void> {
        await ChromeStorage.set({ bannedWords: words });
    },

    async clear(): Promise<void> {
        await ChromeStorage.set({ bannedWords: [] });
    },

    async addAll(bannedWordList: IBannedWord[]): Promise<void> {
        const words: IBannedWord[] = await this.load();

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

    async add(addWord: string): Promise<boolean> {
        const words: IBannedWord[] = await this.load();

        for (const word of words) {
            if (addWord === word.keyword) {
                // do nothing.
                return false;
            }
        }

        words.push({ keyword: addWord, blockType: BlockType.SOFT, target: BannedTarget.TITLE_AND_CONTENTS });
        await this.save(words);
        return true;
    },

    async changeType(changeWord: string, type: BlockType): Promise<void> {
        const words: IBannedWord[] = await this.load();

        const filteredWords = words.map((word) => {
            if (word.keyword !== changeWord) {
                return word;
            }

            word.blockType = type;
            return word;
        });

        await this.save(filteredWords);
    },

    async changeTarget(changeWord: string, target: BannedTarget): Promise<void> {
        const words: IBannedWord[] = await this.load();

        const filteredWords = words.map((word) => {
            if (word.keyword !== changeWord) {
                return word;
            }

            word.target = target;
            return word;
        });

        await this.save(filteredWords);
    },

    async delete(deleteWord: string): Promise<boolean> {
        const words: IBannedWord[] = await this.load();

        const contains = words.find((word) => word.keyword !== deleteWord) !== undefined;
        const filteredWords = words.filter((word) => word.keyword !== deleteWord);

        await this.save(filteredWords);

        return contains;
    },
};
