import { ChromeStorage, Logger, MenuPosition } from '../common';
import BlockedSites from '../model/blocked_sites';
import { BannedWord } from './banned_word_repository';
import { RegExpItem } from './regexp_repository';

export interface OptionInterface<T> {
    load: () => Promise<T>;
    save: (value: T) => Promise<void>;
}

export const OptionRepository = {
    DeveloperMode: {
        load: async (): Promise<boolean> => {
            const items = await ChromeStorage.load({ developerMode: false });

            Logger.mode = items.developerMode;

            return items.developerMode;
        },

        save: async (mode: boolean): Promise<void> => {
            await ChromeStorage.save({ developerMode: mode });

            Logger.mode = mode;

            Logger.log("set 'developerMode' to =>", mode);
        },
    },

    ShowBlockedByWordInfo: {
        load: async (): Promise<boolean> => {
            const items = await ChromeStorage.load({ bannedWord: { showInfo: false } });

            return items.bannedWord.showInfo;
        },

        save: async (showBlockInfo: boolean): Promise<void> => {
            await ChromeStorage.save({ bannedWord: { showInfo: showBlockInfo } });

            Logger.debug("set 'showBlockInfo' to =>", showBlockInfo);
        },
    },

    AutoBlockIDN: {
        load: async (): Promise<boolean> => {
            const items = await ChromeStorage.load({ autoBlockIDN: { enabled: false } });

            return items.autoBlockIDN.enabled;
        },

        save: async (autoBlockIDN: boolean): Promise<void> => {
            await ChromeStorage.save({ autoBlockIDN: { enabled: autoBlockIDN } });

            Logger.debug("set 'autoBlockIDN' to =>", autoBlockIDN);
        },
    },

    DefaultBlockType: {
        load: async (): Promise<string> => {
            const items = await ChromeStorage.load({ defaultBlockType: 'soft' });

            return items.defaultBlockType;
        },

        save: async (defaultBlockType: string): Promise<void> => {
            await ChromeStorage.save({ defaultBlockType });

            Logger.log("set 'defaultBlockType' to =>", defaultBlockType);
        },
    },

    MenuPosition: {
        load: async (): Promise<MenuPosition> => {
            const items = await ChromeStorage.load({ menuPosition: 'default' });
            const { menuPosition } = items;

            switch (menuPosition) {
                case MenuPosition.COMPACT:
                    return MenuPosition.COMPACT;
                case MenuPosition.DEFAULT:
                default:
                    return MenuPosition.DEFAULT;
            }
        },

        save: async (menuPosition: string): Promise<void> => {
            await ChromeStorage.save({ menuPosition });

            Logger.debug("set 'menuPosition' to =>", menuPosition);
        },
    },

    DisplayTemporarilyUnblockAll: {
        load: async (): Promise<boolean> => {
            const items = await ChromeStorage.load({ displayTemporarilyUnblockAll: true });

            return items.displayTemporarilyUnblockAll;
        },

        save: async (displayTemporarilyUnblockAll: boolean): Promise<void> => {
            await ChromeStorage.save({ displayTemporarilyUnblockAll });

            Logger.debug("set 'displayTemporarilyUnblockAll' to =>", displayTemporarilyUnblockAll);
        },
    },

    BlockGoogleNewsTab: {
        load: async (): Promise<boolean> => {
            const items = await ChromeStorage.load({ blockGoogleNewsTab: true });

            return items.blockGoogleNewsTab;
        },

        save: async (blockGoogleNewsTab: boolean): Promise<void> => {
            await ChromeStorage.save({ blockGoogleNewsTab });

            Logger.debug("set 'blockGoogleNewsTab' to =>", blockGoogleNewsTab);
        },
    },
};

export interface Options {
    blockedSites: BlockedSites;
    bannedWords: BannedWord[];
    regexpList: RegExpItem[];
    autoBlockIDN: boolean;
    defaultBlockType: string;
    menuPosition: MenuPosition;
    bannedWordOption: boolean;
    blockGoogleNewsTab: boolean;
}
