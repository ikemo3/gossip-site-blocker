interface IOptionRepository {
    isDeveloperMode(): Promise<boolean>;

    setDeveloperMode(mode: boolean): Promise<void>;

    getAutoBlockIDNOption(): Promise<IAutoBlockIDNOption>;

    setAutoBlockIDNOption(autoBlockIDN: IAutoBlockIDNOption): Promise<void>;

    defaultBlockType(): Promise<string>;

    setDefaultBlockType(type: string): Promise<void>;

    menuPosition(): Promise<MenuPosition>;

    setMenuPosition(position: string): Promise<void>;
}

interface IDefaultBlockTypeOption {
    defaultBlockType: string;
}

interface IDeveloperOption {
    developerMode: boolean;
}

interface IAutoBlockIDNOptionStorage {
    autoBlockIDN: IAutoBlockIDNOption;
}

interface IAutoBlockIDNOption {
    enabled: boolean;
}

interface IMenuPositionOption {
    menuPosition: string;
}

const OptionRepository: IOptionRepository = {
    async isDeveloperMode(): Promise<boolean> {
        const items = await ChromeStorage.get({developerMode: false}) as IDeveloperOption;
        return items.developerMode;
    },

    async setDeveloperMode(mode: boolean): Promise<void> {
        await ChromeStorage.set({developerMode: mode});

        Logger.log("set 'developerMode' to =>", mode);
    },

    async getAutoBlockIDNOption(): Promise<IAutoBlockIDNOption> {
        const autoBlockIDNDefault = {enabled: false};
        const items = await ChromeStorage.get({autoBlockIDN: autoBlockIDNDefault}) as IAutoBlockIDNOptionStorage;
        return items.autoBlockIDN;
    },

    async setAutoBlockIDNOption(autoBlockIDN: IAutoBlockIDNOption): Promise<void> {
        await ChromeStorage.set({autoBlockIDN});

        Logger.debug("set 'autoBlockIDN' to =>", autoBlockIDN);
    },

    async defaultBlockType(): Promise<string> {
        const items = await ChromeStorage.load({defaultBlockType: "soft"}) as IDefaultBlockTypeOption;
        return items.defaultBlockType;
    },

    async setDefaultBlockType(type: string): Promise<void> {
        await ChromeStorage.save({defaultBlockType: type});

        Logger.log("set 'defaultBlockType' to =>", type);
    },

    async menuPosition(): Promise<MenuPosition> {
        const items = await ChromeStorage.load({menuPosition: "bottom"}) as IMenuPositionOption;
        const menuPosition = items.menuPosition;

        switch (menuPosition) {
            case MenuPosition.RIGHT:
                return MenuPosition.RIGHT;
            case MenuPosition.BOTTOM:
            default:
                return MenuPosition.BOTTOM;
        }
    },

    async setMenuPosition(position: string): Promise<void> {
        await ChromeStorage.save({menuPosition: position});

        Logger.debug("set 'menuPosition' to =>", position);
    },
};
