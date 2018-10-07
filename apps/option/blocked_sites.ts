/**
 * @property {Array<BlockedSite>} sites
 */
class BlockedSites {
    public sites: BlockedSite[];

    constructor(sites: BlockedSite[]) {
        this.sites = sites;
    }

    /**
     * Search the site by URL exact match.
     *
     * @param url
     * @returns {BlockedSite|undefined}
     */
    public find(url: string) {
        for (const site of this.sites) {
            if (site.equals(url)) {
                return site;
            }
        }

        return undefined;
    }

    /**
     * Search the site at the beginning of the URL.
     * When it finds more than one, it returns the longest matched one.
     *
     * @param url
     * @returns {BlockedSite|undefined}
     */
    public matches(url: string) {
        /**
         * found element
         * @type {BlockedSite|undefined}
         */
        let found;

        const urlWithoutProtocol = DOMUtils.removeProtocol(url);

        for (const site of this.sites) {
            // Forward match comparison without protocol
            if (site.contains(urlWithoutProtocol)) {
                if (found === undefined || site.strongerThan(found)) {
                    found = site;
                }
            }
        }

        return found;
    }

    /**
     * Returns whether the URL is included in the blocked site.
     *
     * @param url URL
     */
    public contains(url: string) {
        for (const site of this.sites) {
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
