/**
 * Blocked sites
 *
 * @property {string} url Beginning of blocked URL(without scheme).
 * @property {"soft"|"hard"} block_type
 */
class BlockedSite {
    public url: string;
    public block_type: string;

    constructor(item: IBlockedSite) {
        this.url = item.url;
        this.block_type = item.block_type;
    }

    public contains(url: string) {
        return url.startsWith(this.url);
    }

    public equals(url: string) {
        return url === this.url;
    }

    /**
     *
     * @param {BlockedSite} site
     */
    public strongerThan(site: BlockedSite) {
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
