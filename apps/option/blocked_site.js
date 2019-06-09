/**
 * Blocked sites
 *
 * @property {string} url Beginning of blocked URL(without scheme).
 * @property {"soft"|"hard"} block_type
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
     * @return {string} block type(soft / hard)
     */
    getState() {
        return this.block_type;
    }
}
//# sourceMappingURL=blocked_site.js.map