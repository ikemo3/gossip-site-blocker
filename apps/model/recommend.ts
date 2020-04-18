const PATTERN_LIST = [
    /(^d\.hatena\.ne\.jp\/[^/]+\/)/,
    /(^ameblo\.jp\/[^/]+\/)/,
    /(^blog\.livedoor\.jp\/[^/]+\/)/,
    /(^twitter\.com\/[^/]+)/,
    /(^w\.atwiki\.jp\/[^/]+\/)/,
    /(^wikiwiki\.jp\/[^/]+\/)/,
    /(^news\.yahoo\.co\.jp\/byline\/[^/]+\/)/,
    /(^note\.com\/[^/]+)/,
];

function search(urlWithoutProtocol: string, pattern: RegExp): string | null {
    const found = urlWithoutProtocol.match(pattern);
    if (!found) {
        return null;
    }

    const recommended = found[0];

    // If the recommended URL is exactly the same as the original URL, it returns null.
    // Because there is no point in recommending it.
    if (recommended === urlWithoutProtocol) {
        return null;
    }

    return recommended;
}

export default function makeRecommendUrl(urlWithoutProtocol: string): string | null {
    for (const pattern of PATTERN_LIST) {
        const recommended = search(urlWithoutProtocol, pattern);
        if (recommended !== null) {
            return recommended;
        }
    }

    return null;
}
