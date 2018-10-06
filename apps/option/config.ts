interface IOptionRepository {
    isDeveloperMode(): Promise<boolean>;

    setDeveloperMode(mode: boolean): Promise<void>;
}

interface IDeveloperOption {
    developerMode: boolean;
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
};
