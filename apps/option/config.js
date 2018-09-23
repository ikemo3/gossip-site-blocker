const OptionRepository = {
    async init() {
        this.developerMode = await ChromeStorage.get({ developerMode: false });
    },
    /**
     * @return {boolean}
     */
    isDeveloperMode() {
        return this.developerMode;
    },
    /**
     * @param {boolean} mode
     * @return {Promise<void>}
     */
    async setDeveloperMode(mode) {
        await ChromeStorage.set({ developerMode: mode });
        this.developerMode = mode;
        Logger.debug("set 'developerMode' to =>", mode);
    },
};
// initialize
OptionRepository.init();
//# sourceMappingURL=config.js.map