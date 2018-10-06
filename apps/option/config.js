const OptionRepository = {
    async isDeveloperMode() {
        const items = await ChromeStorage.get({ developerMode: false });
        const developerMode = items.developerMode;
        Logger.log("developerMode is ", developerMode);
        return developerMode;
    },
    async setDeveloperMode(mode) {
        await ChromeStorage.set({ developerMode: mode });
        Logger.log("set 'developerMode' to =>", mode);
    },
    async getAutoBlockIDNOption() {
        const autoBlockIDNDefault = { enabled: false };
        const items = await ChromeStorage.get({ autoBlockIDN: autoBlockIDNDefault });
        const autoBlockIDN = items.autoBlockIDN;
        Logger.debug("autoBlockIDN is ", autoBlockIDN);
        return autoBlockIDN;
    },
    async setAutoBlockIDNOption(autoBlockIDN) {
        await ChromeStorage.set({ autoBlockIDN });
        Logger.log("set 'autoBlockIDN' to =>", autoBlockIDN);
    },
};
//# sourceMappingURL=config.js.map