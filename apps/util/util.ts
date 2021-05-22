function removeProtocol(url: string): string {
    return url.replace(/^\w+:\/\//, "").replace(/#.*/, "");
}

export default removeProtocol;
