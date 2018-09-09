/**
 * Blocked sites
 *
 * @property {string} url
 * @property {"soft"|"hard"} block_type
 */
class BlockedSite {
    public url: string;
    public block_type: string;

    constructor(item) {
        this.url = item.url;
        this.block_type = item.block_type;
    }

    public contains(url) {
        return url.startsWith(this.url);
    }

    public equals(url) {
        return url === this.url;
    }

    /**
     *
     * @param {BlockedSite} site
     */
    public strongerThan(site) {
        return this.url.length > site.url.length;
    }

    getUrl() {
        return this.url;
    }

    /**
     *
     * @return {string} block type(soft / hard)
     */
    public getState() {
        return this.block_type;
    }
}
