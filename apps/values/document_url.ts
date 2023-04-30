class DocumentURL {
    private readonly url: URL;

    constructor(url: string) {
        this.url = new URL(url);
    }

    isGoogleSearchNewsTab(): boolean {
        const params = this.url.searchParams;
        return params.get("tbm") === "nws";
    }

    isGoogleSearchImageTab(): boolean {
        const params = this.url.searchParams;
        return params.get("tbm") === "isch";
    }

    isGoogleSearch(): boolean {
        return !this.isGoogleSearchNewsTab() && !this.isGoogleSearchImageTab();
    }
}

export default DocumentURL;
