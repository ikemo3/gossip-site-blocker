const OptionRepository = {
    init: async function() {
        this.developerMode = await ChromeStorage.get({developerMode: false});
    },

    /**
     * @return {boolean}
     */
    isDeveloperMode: function() {
        return this.developerMode;
    },

    /**
     * @param {boolean} mode
     * @return {Promise<void>}
     */
    setDeveloperMode: async function(mode) {
        await ChromeStorage.set({developerMode: mode});
        this.developerMode = mode;

        Logger.debug("set 'developerMode' to =>", mode);
    }
};

// initialize
OptionRepository.init();
