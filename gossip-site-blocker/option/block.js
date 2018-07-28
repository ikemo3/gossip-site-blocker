const BlockedSitesRepository = {
    /**
     * Arrayで値をロードする
     *
     * @returns {Promise<Array<BlockedSite>>}
     */
    loadData: async function () {
        // アイテムの取得
        const items = await Storage.get({blocked: []});

        const sites = [];

        for (const item of items.blocked) {
            const site = new BlockedSite(item);
            sites.push(site);
        }

        return sites;
    },

    /**
     * 値をロードする。
     *
     * @returns {Promise<BlockedSites>}
     */
    load: async function () {
        const sites = await BlockedSitesRepository.loadData();

        return new BlockedSites(sites);
    },

    /**
     * @params {Array<Object>>} blockList
     * @returns {Promise<BlockedSites>}
     */
    addAll: async function (blockList) {
        const siteArray = await BlockedSitesRepository.loadData();

        for (const block of blockList) {
            const found = siteArray.some(site => {
                return site.url === block.url;
            });

            if (!found) {
                const site = new BlockedSite({url: block.url, block_type: block.block_type});
                siteArray.push(site);
            }
        }

        // 保存
        await this.save(siteArray);

        return new BlockedSites(siteArray);
    },

    /**
     * URLを追加する。
     *
     * @returns {Promise<BlockedSites>}
     */
    add: async function (url) {
        const siteArray = await BlockedSitesRepository.loadData();

        const found = siteArray.some(site => {
            return site.url === url;
        });

        // 見つからなかったときは追加
        if (!found) {
            const site = new BlockedSite({url: url, block_type: "soft"});
            siteArray.push(site);
        }

        // 保存
        await this.save(siteArray);

        return new BlockedSites(siteArray);
    },

    /**
     * URLを削除する。
     *
     * @returns {Promise<BlockedSites>}
     */
    del: async function (url) {
        const siteArray = await BlockedSitesRepository.loadData();

        // URLが一致するものを削除
        const newSiteArray = siteArray.filter(site => {
            return !site.equals(url);
        });

        // 保存
        await this.save(newSiteArray);

        return new BlockedSites(newSiteArray);
    },

    edit: async function (beforeUrl, afterUrl) {
        const sites = await BlockedSitesRepository.load();
        const site = sites.find(beforeUrl);

        if (site !== undefined) {
            site.url = afterUrl;

            await BlockedSitesRepository.save(sites.sites);
        }
    },

    toHard: async function (url) {
        const sites = await BlockedSitesRepository.load();
        const site = sites.find(url);

        site.block_type = "hard";

        await BlockedSitesRepository.save(sites.sites);
    },

    toSoft: async function (url) {
        const sites = await BlockedSitesRepository.load();
        const site = sites.find(url);

        site.block_type = "soft";

        await BlockedSitesRepository.save(sites.sites);
    },

    /**
     *
     * @param sites {Array<BlockedSite>}
     * @returns {Promise<void>}
     */
    save: async function (sites) {
        await Storage.set({blocked: sites});
    },

    clear: async function () {
        await Storage.set({blocked: []});
    }
};

/**
 * ブロックしたサイトの集合
 *
 * @property {array<BlockedSite>} sites
 */
class BlockedSites {
    constructor(sites) {
        this.sites = sites;
    }

    /**
     * サイトをURLの完全一致で検索します。
     *
     * @param url
     * @returns {BlockedSite|undefined}
     */
    find(url) {
        for (let site of this.sites) {
            if (site.equals(url)) {
                return site;
            }
        }

        return undefined;
    }

    /**
     * サイトをURLの先頭一致で検索します。
     * 複数見つかったときは、最も長くマッチしたものを返します。
     *
     * @param url
     * @returns {BlockedSite|undefined}
     */
    matches(url) {
        /**
         * 見つかった要素
         * @type {BlockedSite|undefined}
         */
        let found = undefined;

        const urlWithoutProtocol = DOMUtils.removeProtocol(url);

        for (let site of this.sites) {
            // プロトコルなしで前方一致比較
            if (site.contains(urlWithoutProtocol)) {
                if (found === undefined || site.strongerThan(found)) {
                    found = site;
                }
            }
        }

        return found;
    }

    /**
     * URLがブロックするサイトに含まれているかどうかを返します。
     *
     * @param url URL
     */
    contains(url) {
        for (let site of this.sites) {
            if (site.contains(url)) {
                return true;
            }
        }

        return false;
    }

    [Symbol.iterator]() {
        return this.sites.values();
    }
}

/**
 * プロックしたサイト
 *
 * @property {string} url サイトのURL
 * @property {"soft"|"hard"} block_type ブロックタイプ
 */
class BlockedSite {
    constructor(item) {
        this.url = item.url;
        this.block_type = item.block_type;
    }

    contains(url) {
        return url.startsWith(this.url);
    }

    equals(url) {
        return url === this.url;
    }

    /**
     *
     * @param {BlockedSite} site
     */
    strongerThan(site) {
        return this.url.length > site.url.length;
    }

    getUrl() {
        return this.url;
    }

    /**
     *
     * @return {string} ブロックタイプ
     */
    getState() {
        return this.block_type;
    }
}
