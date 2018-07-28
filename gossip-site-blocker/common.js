const Storage = {
    get: async function (keys) {
        return new Promise(resolve => {
            chrome.storage.local.get(keys, resolve);
        });
    },

    set: async function (items) {
        return new Promise(resolve => {
            chrome.storage.local.set(items, resolve);
        });
    }
};

const Logger = {
    debug: function (message, ...params) {
        if (OptionRepository.isDeveloperMode()) {
            console.log(message, ...params);
        }
    }
};

const DOMUtils = {
    /**
     * add element later.
     *
     * @param element
     * @param insertElement element to add.
     */
    insertAfter: function (element, insertElement) {
        element.parentElement.insertBefore(insertElement, element.nextSibling);
    },

    /**
     * get hostname from URL string.
     *
     * example: https://example.com/path -> example.com
     * @param {string} url URL string
     * @return {string} hostname
     */
    getHostName: function (url) {
        const tmp = document.createElement('a');
        tmp.href = url;
        return tmp.hostname;
    },

    /**
     * delete protocol(scheme) from URL string.
     *
     * @param {string} url URL string
     * @return {string} string without protocol(scheme)
     */
    removeProtocol: function (url) {
        return url.replace(/^\w+:\/\//, "");
    }
};
