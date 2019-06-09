const OptionRepository = {
    async isDeveloperMode() {
        const items = await ChromeStorage.get({ developerMode: false });
        return items.developerMode;
    },
    async setDeveloperMode(mode) {
        await ChromeStorage.set({ developerMode: mode });
        Logger.log("set 'developerMode' to =>", mode);
    },
    async showBlockedByWordInfo() {
        const bannedWordDefault = { showInfo: false };
        const items = await ChromeStorage.get({ bannedWord: bannedWordDefault });
        return items.bannedWord;
    },
    async setShowBlockedByWordInfo(showBlockInfo) {
        const values = { showInfo: showBlockInfo };
        await ChromeStorage.set({ bannedWord: values });
        Logger.debug("set 'bannedWord' to =>", values);
    },
    async getAutoBlockIDNOption() {
        const autoBlockIDNDefault = { enabled: false };
        const items = await ChromeStorage.get({ autoBlockIDN: autoBlockIDNDefault });
        return items.autoBlockIDN;
    },
    async setAutoBlockIDNOption(autoBlockIDN) {
        await ChromeStorage.set({ autoBlockIDN });
        Logger.debug("set 'autoBlockIDN' to =>", autoBlockIDN);
    },
    async defaultBlockType() {
        const items = await ChromeStorage.load({ defaultBlockType: "soft" });
        return items.defaultBlockType;
    },
    async setDefaultBlockType(type) {
        await ChromeStorage.save({ defaultBlockType: type });
        Logger.log("set 'defaultBlockType' to =>", type);
    },
    async menuPosition() {
        const items = await ChromeStorage.load({ menuPosition: "default" });
        const menuPosition = items.menuPosition;
        switch (menuPosition) {
            case MenuPosition.COMPACT:
                return MenuPosition.COMPACT;
            case MenuPosition.DEFAULT:
            default:
                return MenuPosition.DEFAULT;
        }
    },
    async setMenuPosition(position) {
        await ChromeStorage.save({ menuPosition: position });
        Logger.debug("set 'menuPosition' to =>", position);
    },
};
//# sourceMappingURL=config.js.map