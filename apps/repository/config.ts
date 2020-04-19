import { ChromeStorage, Logger, MenuPosition } from '../common';
import BlockedSites from '../model/blocked_sites';
import { BannedWord } from './banned_word_repository';
import { RegExpItem } from './regexp_repository';

export const OptionRepository = {
    async isDeveloperMode(): Promise<boolean> {
        const items = await ChromeStorage.load({ developerMode: false });

        Logger.mode = items.developerMode;

        return items.developerMode;
    },

    async setDeveloperMode(mode: boolean): Promise<void> {
        await ChromeStorage.save({ developerMode: mode });

        Logger.mode = mode;

        Logger.log("set 'developerMode' to =>", mode);
    },

    async getBannedWordOption(): Promise<boolean> {
        const items = await ChromeStorage.load({ bannedWord: { showInfo: false } });

        return items.bannedWord.showInfo;
    },

    async setShowBlockedByWordInfo(showBlockInfo: boolean): Promise<void> {
        await ChromeStorage.save({ bannedWord: { showInfo: showBlockInfo } });

        Logger.debug("set 'showBlockInfo' to =>", showBlockInfo);
    },

    async getAutoBlockIDNOption(): Promise<boolean> {
        const items = await ChromeStorage.load({ autoBlockIDN: { enabled: false } });

        return items.autoBlockIDN.enabled;
    },

    async setAutoBlockIDNOption(autoBlockIDN: boolean): Promise<void> {
        await ChromeStorage.save({ autoBlockIDN: { enabled: autoBlockIDN } });

        Logger.debug("set 'autoBlockIDN' to =>", autoBlockIDN);
    },

    async defaultBlockType(): Promise<string> {
        const items = await ChromeStorage.load({ defaultBlockType: 'soft' });

        return items.defaultBlockType;
    },

    async setDefaultBlockType(defaultBlockType: string): Promise<void> {
        await ChromeStorage.save({ defaultBlockType });

        Logger.log("set 'defaultBlockType' to =>", defaultBlockType);
    },

    async menuPosition(): Promise<MenuPosition> {
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

    async setMenuPosition(menuPosition: string): Promise<void> {
        await ChromeStorage.save({ menuPosition });

        Logger.debug("set 'menuPosition' to =>", menuPosition);
    },

    async isDisplayTemporarilyUnblockAll(): Promise<boolean> {
        const items = await ChromeStorage.load({ displayTemporarilyUnblockAll: true });

        return items.displayTemporarilyUnblockAll;
    },

    async setDisplayTemporarilyUnblockAll(displayTemporarilyUnblockAll: boolean): Promise<void> {
        await ChromeStorage.save({ displayTemporarilyUnblockAll });

        Logger.debug("set 'displayTemporarilyUnblockAll' to =>", displayTemporarilyUnblockAll);
    },

    async isBlockGoogleNewsTab(): Promise<boolean> {
        const items = await ChromeStorage.load({ blockGoogleNewsTab: true });

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
    autoBlockIDN: boolean;
    defaultBlockType: string;
    menuPosition: MenuPosition;
    bannedWordOption: boolean;
    blockGoogleNewsTab: boolean;
}
