interface IOptionRepository {
    isDeveloperMode(): Promise<boolean>;

    setDeveloperMode(mode: boolean): Promise<void>;

    getAutoBlockIDNOption(): Promise<IAutoBlockIDNOption>;

    setAutoBlockIDNOption(autoBlockIDN: IAutoBlockIDNOption): Promise<void>;
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
};
