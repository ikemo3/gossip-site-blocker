import { BlockType, ChromeStorage, Logger } from '../common';

interface RegExpItemList {
    regexpList: RegExpItem[];
}

export interface RegExpItem {
    pattern: string;
    blockType: BlockType;
}

export const RegExpRepository = {
    async load(): Promise<RegExpItem[]> {
        const items = await ChromeStorage.get({ regexpList: [] }) as RegExpItemList;

        const itemsCopy = items.regexpList;

        for (const item of itemsCopy) {
            if (!item.blockType) {
                item.blockType = BlockType.SOFT;
            }
        }

        Logger.debug('regexpList: ', itemsCopy);

        return itemsCopy;
    },

    async save(items: RegExpItem[]): Promise<void> {
        await ChromeStorage.set({ regexpList: items });
    },

    async clear(): Promise<void> {
        await ChromeStorage.set({ regexpList: [] });
    },

    async addAll(regexpList: RegExpItem[]): Promise<void> {
        const items: RegExpItem[] = await this.load();

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

    async add(pattern: string, blockType: BlockType = BlockType.SOFT): Promise<boolean> {
        const items: RegExpItem[] = await this.load();

        for (const item of items) {
            if (pattern === item.pattern) {
                // do nothing.
                return false;
            }
        }

        items.push({ pattern, blockType });
        await this.save(items);
        return true;
    },

    async changeType(pattern: string, type: BlockType): Promise<void> {
        const items: RegExpItem[] = await this.load();

        const filteredItems = items.map((item) => {
            if (item.pattern !== pattern) {
                return item;
            }

            // eslint-disable-next-line no-param-reassign
            item.blockType = type;
            return item;
        });

        await this.save(filteredItems);
    },

    async delete(deletePattern: string): Promise<boolean> {
        const items: RegExpItem[] = await this.load();

        const contains = items.find((item) => item.pattern !== deletePattern) !== undefined;
        const filteredPatterns = items.filter((item) => item.pattern !== deletePattern);

        await this.save(filteredPatterns);

        return contains;
    },
};
