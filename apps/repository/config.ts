import { ChromeStorage, Logger, MenuPosition } from '../common';
import BlockedSites from '../model/blocked_sites';
import { BannedWord } from './banned_word_repository';
import { RegExpItem } from './regexp_repository';

interface BannedWordOptionStorage {
    bannedWord: BannedWordOption;
}

export interface BannedWordOption {
    showInfo: boolean;
}

interface AutoBlockIDNOptionStorage {
    autoBlockIDN: AutoBlockIDNOption;
}

export interface AutoBlockIDNOption {
    enabled: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export const OptionRepository = {
    async isDeveloperMode(): Promise<boolean> {
        interface DeveloperOption {
            developerMode: boolean;
        }

        const items = (await ChromeStorage.get({ developerMode: false })) as DeveloperOption;

        Logger.mode = items.developerMode;

        return items.developerMode;
    },

    async setDeveloperMode(mode: boolean): Promise<void> {
        await ChromeStorage.set({ developerMode: mode });

        Logger.mode = mode;

        Logger.log("set 'developerMode' to =>", mode);
    },

    async getBannedWordOption(): Promise<BannedWordOption> {
        const bannedWordDefault = { showInfo: false };
        const items: BannedWordOptionStorage = await ChromeStorage.get({
            bannedWord: bannedWordDefault,
        });
        return items.bannedWord;
    },

    async setShowBlockedByWordInfo(showBlockInfo: boolean): Promise<void> {
        const values: BannedWordOption = { showInfo: showBlockInfo };
        await ChromeStorage.set({ bannedWord: values });

        Logger.debug("set 'bannedWord' to =>", values);
    },

    async getAutoBlockIDNOption(): Promise<AutoBlockIDNOption> {
        const autoBlockIDNDefault = { enabled: false };
        const items: AutoBlockIDNOptionStorage = (await ChromeStorage.get({
            autoBlockIDN: autoBlockIDNDefault,
        })) as AutoBlockIDNOptionStorage;
        return items.autoBlockIDN;
    },

    async setAutoBlockIDNOption(autoBlockIDN: AutoBlockIDNOption): Promise<void> {
        await ChromeStorage.set({ autoBlockIDN });

        Logger.debug("set 'autoBlockIDN' to =>", autoBlockIDN);
    },

    async defaultBlockType(): Promise<string> {
        interface DefaultBlockTypeOption {
            defaultBlockType: string;
        }

        const items = (await ChromeStorage.load({
            defaultBlockType: 'soft',
        })) as DefaultBlockTypeOption;
        return items.defaultBlockType;
    },

    async setDefaultBlockType(type: string): Promise<void> {
        await ChromeStorage.save({ defaultBlockType: type });

        Logger.log("set 'defaultBlockType' to =>", type);
    },

    async menuPosition(): Promise<MenuPosition> {
        interface MenuPositionOption {
            menuPosition: string;
        }

        interface MenuPositionOption {
            menuPosition: string;
        }

        const items = (await ChromeStorage.load({ menuPosition: 'default' })) as MenuPositionOption;
        const { menuPosition } = items;

        switch (menuPosition) {
            case MenuPosition.COMPACT:
                return MenuPosition.COMPACT;
            case MenuPosition.DEFAULT:
            default:
                return MenuPosition.DEFAULT;
        }
    },

    async setMenuPosition(position: string): Promise<void> {
        await ChromeStorage.save({ menuPosition: position });

        Logger.debug("set 'menuPosition' to =>", position);
    },

    async isDisplayTemporarilyUnblockAll(): Promise<boolean> {
        interface DisplayTemporarilyUnblockAllOption {
            displayTemporarilyUnblockAll: boolean;
        }

        const items = (await ChromeStorage.load({
            displayTemporarilyUnblockAll: true,
        })) as DisplayTemporarilyUnblockAllOption;

        return items.displayTemporarilyUnblockAll;
    },

    async setDisplayTemporarilyUnblockAll(displayTemporarilyUnblockAll: boolean): Promise<void> {
        await ChromeStorage.save({ displayTemporarilyUnblockAll });
        Logger.debug("set 'displayTemporarilyUnblockAll' to =>", displayTemporarilyUnblockAll);
    },

    async isBlockGoogleNewsTab(): Promise<boolean> {
        interface BlockGoogleNewsTabOption {
            blockGoogleNewsTab: boolean;
        }

        const items = (await ChromeStorage.load({
            blockGoogleNewsTab: true,
        })) as BlockGoogleNewsTabOption;

        return items.blockGoogleNewsTab;
    },

    async setBlockGoogleNewsTab(blockGoogleNewsTab: boolean): Promise<void> {
        await ChromeStorage.save({ blockGoogleNewsTab });
        Logger.debug("set 'blockGoogleNewsTab' to =>", blockGoogleNewsTab);
    },
};

export interface Options {
    blockedSites: BlockedSites;
    bannedWords: BannedWord[];
    regexpList: RegExpItem[];
    idnOption: AutoBlockIDNOption;
    defaultBlockType: string;
    menuPosition: MenuPosition;
    bannedWordOption: BannedWordOption;
    blockGoogleNewsTab: boolean;
}
