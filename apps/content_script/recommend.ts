export default function makeRecommendUrl(urlWithoutProtocol: string): string | null {
    let recommended = makeRecommendUrlCommon(urlWithoutProtocol, 'd.hatena.ne.jp');
    if (recommended !== null) {
        return recommended;
    }

    recommended = makeRecommendUrlCommon(urlWithoutProtocol, 'ameblo.jp');
    if (recommended !== null) {
        return recommended;
    }

    recommended = makeRecommendUrlCommon(urlWithoutProtocol, 'blog.livedoor.jp');
    if (recommended !== null) {
        return recommended;
    }

    return null;
}

function makeRecommendUrlCommon(urlWithoutProtocol: string, prefix: string): string | null {
    if (urlWithoutProtocol.startsWith(prefix)) {
        const index = urlWithoutProtocol.indexOf('/', prefix.length + 1);
        if (index !== -1) {
            const recommended = urlWithoutProtocol.substring(0, index + 1);

            if (recommended === urlWithoutProtocol) {
                return null;
            }
            return recommended;
        }
    }

    return null;
}
