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
};
//# sourceMappingURL=config.js.map