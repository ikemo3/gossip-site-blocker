class DocumentURL {
    private readonly url: URL;

    constructor() {
        this.url = new URL(document.location.href);
    }

    isGoogleSearchNewsTab(): boolean {
        const params = this.url.searchParams;
        return params.get('tbm') === 'nws';
    }

    isGoogleSearch(): boolean {
        return !this.isGoogleSearchNewsTab();
    }
}

export default DocumentURL;
