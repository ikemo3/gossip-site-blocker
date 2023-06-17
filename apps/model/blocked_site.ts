/**
 * Blocked sites
 *
 * @property {string} url Beginning of blocked URL(without scheme).
 * @property {"soft"|"hard"} block_type
 */
class BlockedSite {
  public url: string;

  public block_type: string;

  constructor(url: string, blockType: string) {
    this.url = url;
    this.block_type = blockType;
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

export default BlockedSite;
