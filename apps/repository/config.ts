import { ChromeStorage, Logger, MenuPosition } from '../common';

interface IDefaultBlockTypeOption {
    defaultBlockType: string;
}

interface IDeveloperOption {
    developerMode: boolean;
}

interface IBannedWordOptionStorage {
    bannedWord: IBannedWordOption;
}

export interface IBannedWordOption {
    showInfo: boolean;
}

interface IAutoBlockIDNOptionStorage {
    autoBlockIDN: AutoBlockIDNOption;
}

export interface AutoBlockIDNOption {
    enabled: boolean;
}

interface MenuPositionOption {
    menuPosition: string;
}

export const OptionRepository = {
    async isDeveloperMode(): Promise<boolean> {
        const items = await ChromeStorage.get({ developerMode: false }) as IDeveloperOption;

        Logger.mode = items.developerMode;

        return items.developerMode;
    },

    async setDeveloperMode(mode: boolean): Promise<void> {
        await ChromeStorage.set({ developerMode: mode });

        Logger.mode = mode;

        Logger.log("set 'developerMode' to =>", mode);
    },

    async getBannedWordOption(): Promise<IBannedWordOption> {
        const bannedWordDefault = { showInfo: false };
        const items: IBannedWordOptionStorage = await ChromeStorage.get(
            { bannedWord: bannedWordDefault },
        );
        return items.bannedWord;
    },

    async setShowBlockedByWordInfo(showBlockInfo: boolean): Promise<void> {
        const values: IBannedWordOption = { showInfo: showBlockInfo };
        await ChromeStorage.set({ bannedWord: values });

        Logger.debug("set 'bannedWord' to =>", values);
    },

    async getAutoBlockIDNOption(): Promise<AutoBlockIDNOption> {
        const autoBlockIDNDefault = { enabled: false };
        const items: IAutoBlockIDNOptionStorage = await ChromeStorage.get(
            { autoBlockIDN: autoBlockIDNDefault },
        ) as IAutoBlockIDNOptionStorage;
        return items.autoBlockIDN;
    },

    async setAutoBlockIDNOption(autoBlockIDN: AutoBlockIDNOption): Promise<void> {
        await ChromeStorage.set({ autoBlockIDN });

        Logger.debug("set 'autoBlockIDN' to =>", autoBlockIDN);
    },

    async defaultBlockType(): Promise<string> {
        const items = await ChromeStorage.load({ defaultBlockType: 'soft' }) as IDefaultBlockTypeOption;
        return items.defaultBlockType;
    },

    async setDefaultBlockType(type: string): Promise<void> {
        await ChromeStorage.save({ defaultBlockType: type });

        Logger.log("set 'defaultBlockType' to =>", type);
    },

    async menuPosition(): Promise<MenuPosition> {
        const items = await ChromeStorage.load({ menuPosition: 'default' }) as MenuPositionOption;
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
};
