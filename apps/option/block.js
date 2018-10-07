const BlockedSitesRepository = {
    /**
     * load values as Array.
     *
     * @returns {Promise<Array<BlockedSite>>}
     */
    async loadData() {
        const items = await ChromeStorage.get({ blocked: [] });
        const sites = [];
        for (const item of items.blocked) {
            const site = new BlockedSite(item);
            sites.push(site);
        }
        return sites;
    },
    /**
     * load values.
     *
     * @returns {Promise<BlockedSites>}
     */
    async load() {
        const sites = await BlockedSitesRepository.loadData();
        return new BlockedSites(sites);
    },
    async addAll(blockList) {
        const siteArray = await BlockedSitesRepository.loadData();
        for (const block of blockList) {
            const found = siteArray.some((site) => {
                return site.url === block.url;
            });
            if (!found) {
                const site = new BlockedSite({ url: block.url, block_type: block.block_type });
                siteArray.push(site);
            }
        }
        await this.save(siteArray);
        return new BlockedSites(siteArray);
    },
    /**
     * add URL to block.
     *
     * @param url {string} url to block.
     * @param blockType {string} type to block(soft/hard)
     * @returns {Promise<BlockedSites>}
     */
    async add(url, blockType) {
        const siteArray = await BlockedSitesRepository.loadData();
        const found = siteArray.some((site) => {
            return site.url === url;
        });
        // add if not found.
        if (!found) {
            const site = new BlockedSite({ url, block_type: blockType });
            siteArray.push(site);
        }
        await this.save(siteArray);
        return new BlockedSites(siteArray);
    },
    /**
     * delete URL from blocked.
     *
     * @returns {Promise<BlockedSites>}
     */
    async del(url) {
        const siteArray = await BlockedSitesRepository.loadData();
        // delete items whose URL matches.
        const newSiteArray = siteArray.filter((site) => {
            return !site.equals(url);
        });
        await this.save(newSiteArray);
        return new BlockedSites(newSiteArray);
    },
    async edit(beforeUrl, afterUrl) {
        const sites = await BlockedSitesRepository.load();
        const site = sites.find(beforeUrl);
        if (site !== undefined) {
            site.url = afterUrl;
            await BlockedSitesRepository.save(sites.sites);
        }
    },
    async toHard(url) {
        const sites = await BlockedSitesRepository.load();
        const site = sites.find(url);
        site.block_type = "hard";
        await BlockedSitesRepository.save(sites.sites);
    },
    async toSoft(url) {
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
    async save(sites) {
        await ChromeStorage.set({ blocked: sites });
    },
    async clear() {
        await ChromeStorage.set({ blocked: [] });
    },
};
//# sourceMappingURL=block.js.map