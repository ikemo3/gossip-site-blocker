const ChromeStorage = {
    async get(keys: any) {
        return new Promise((resolve) => {
            chrome.storage.local.get(keys, resolve);
        });
    },

    async set(items: any) {
        return new Promise((resolve) => {
            chrome.storage.local.set(items, resolve);
        });
    },
};

// noinspection TsLint
const Logger = {
    debug(message: any, ...params: any[]) {
        OptionRepository.isDeveloperMode().then((developerMode: boolean) => {
            if (developerMode) {
                // noinspection TsLint
                console.log(message, ...params);
            }
        });
    },

    log(message: any, ...params: any[]) {
        // noinspection TsLint
        console.log(message, ...params);
    },

    error(message: any, ...params: any[]) {
        // noinspection TsLint
        console.error(message, ...params);
    },
};

const DOMUtils = {
    /**
     * add element later.
     *
     * @param element
     * @param insertElement element to add.
     */
    insertAfter(element: Element, insertElement: Element) {
        element.parentElement!.insertBefore(insertElement, element.nextSibling);
    },

    /**
     * get hostname from URL string.
     *
     * example: https://example.com/path -> example.com
     * @param {string} url URL string
     * @return {string} hostname
     */
    getHostName(url: string): string {
        const tmp = document.createElement("a");
        tmp.href = url;
        return tmp.hostname;
    },

    /**
     * delete protocol(scheme) from URL string.
     *
     * @param {string} url URL string
     * @return {string} string without protocol(scheme)
     */
    removeProtocol(url: string) {
        return url.replace(/^\w+:\/\//, "");
    },
};
