function makeRecommendUrl(urlWithoutProtocol) {
    let recommended = makeRecommendUrlCommon(urlWithoutProtocol, "d.hatena.ne.jp");
    if (recommended !== null) {
        return recommended;
    }
    recommended = makeRecommendUrlCommon(urlWithoutProtocol, "ameblo.jp");
    if (recommended !== null) {
        return recommended;
    }
    recommended = makeRecommendUrlCommon(urlWithoutProtocol, "blog.livedoor.jp");
    if (recommended !== null) {
        return recommended;
    }
    return null;
}
function makeRecommendUrlCommon(urlWithoutProtocol, prefix) {
    if (urlWithoutProtocol.startsWith(prefix)) {
        const index = urlWithoutProtocol.indexOf("/", prefix.length + 1);
        if (index !== -1) {
            const recommended = urlWithoutProtocol.substring(0, index + 1);
            if (recommended === urlWithoutProtocol) {
                return null;
            }
            else {
                return recommended;
            }
        }
    }
    return null;
}
//# sourceMappingURL=recommend.js.map