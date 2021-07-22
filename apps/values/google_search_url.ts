class GoogleSearchURL {
    private readonly href: string;

    constructor(href: string) {
        this.href = href;
    }

    getURLParameter(): string | null {
        const params = new URLSearchParams(this.href);
        return params.get("url");
    }
}

export default GoogleSearchURL;
