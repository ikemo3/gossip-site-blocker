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
        const developerMode = items.developerMode;

        Logger.log("developerMode is ", developerMode);

        return developerMode;
    },

    async setDeveloperMode(mode: boolean): Promise<void> {
        await ChromeStorage.set({developerMode: mode});

        Logger.log("set 'developerMode' to =>", mode);
    },

    async getAutoBlockIDNOption(): Promise<IAutoBlockIDNOption> {
        const autoBlockIDNDefault = {enabled: false};
        const items = await ChromeStorage.get({autoBlockIDN: autoBlockIDNDefault}) as IAutoBlockIDNOptionStorage;
        const autoBlockIDN = items.autoBlockIDN;

        Logger.debug("autoBlockIDN is ", autoBlockIDN);

        return autoBlockIDN;
    },

    async setAutoBlockIDNOption(autoBlockIDN: IAutoBlockIDNOption): Promise<void> {
        await ChromeStorage.set({autoBlockIDN});

        Logger.log("set 'autoBlockIDN' to =>", autoBlockIDN);
    },
};
