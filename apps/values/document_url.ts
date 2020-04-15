class DocumentURL {
    private readonly url: URL;

    constructor() {
        this.url = new URL(document.location.href);
    }

    isGoogleNews(): boolean {
        const params = this.url.searchParams;
        return params.get('tbm') === 'nws';
    }

    isGoogleSearch(): boolean {
        return !this.isGoogleNews();
    }
}

export default DocumentURL;
