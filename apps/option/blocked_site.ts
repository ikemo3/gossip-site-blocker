/**
 * Blocked sites
 *
 * @property {string} url Beginning of blocked URL(without scheme).
 * @property {"soft"|"hard"} block_type
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class BlockedSite {
    public url: string;

    public block_type: string;

    constructor(item: IBlockedSite) {
        this.url = item.url;
        this.block_type = item.block_type;
    }

    public contains(url: string): boolean {
        return url.startsWith(this.url);
    }

    public equals(url: string): boolean {
        return url === this.url;
    }

    /**
     *
     * @param {BlockedSite} site
     */
    public strongerThan(site: BlockedSite): boolean {
        return this.url.length > site.url.length;
    }

    getUrl(): string {
        return this.url;
    }

    /**
     *
     * @return {string} block type(soft / hard)
     */
    public getState(): string {
        return this.block_type;
    }
}
