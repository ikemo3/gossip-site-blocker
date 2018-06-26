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
     * 要素を後に追加
     *
     * @param element 挿入元の要素
     * @param insertElement 挿入する要素
     */
    insertAfter: function (element, insertElement) {
        element.parentElement.insertBefore(insertElement, element.nextSibling);
    },

    /**
     * ホスト名を取得する。
     *
     * 例: https://example.com/path -> example.com
     * @param {string} url URL文字列
     * @return {string} ホスト名
     */
    getHostName: function (url) {
        const tmp = document.createElement('a');
        tmp.href = url;
        return tmp.hostname;
    },

    /**
     * URLからプロトコル(スキーム)を削除する
     * @param {string} url URL文字列
     * @return {string} プロトコルを削除した文字列
     */
    removeProtocol: function (url) {
        return url.replace(/^\w+:\/\//, "");
    }
};
