async function exportClicked() {
    const sites = await BlockedSitesRepository.load();

    // block
    const lines = [];
    for (const site of sites) {
        const line = `${site.url} ${site.block_type}`;
        lines.push(line);
    }

    lines.sort();

    // banned words
    const bannedLines = [];
    const words: IBannedWord[] = await BannedWordRepository.load();
    for (const word of words) {
        const escaped = word.keyword.replace(/ /g, '+');
        const { blockType } = word;
        const { target } = word;
        const line = `${escaped} banned ${blockType} ${target}`;
        bannedLines.push(line);
    }

    bannedLines.sort();

    // regexp
    const regexpLines = [];
    const regexpList = await RegExpRepository.load();
    for (const regexp of regexpList) {
        const escaped = $.escape(regexp.pattern);
        const { blockType } = regexp;
        const line = `${escaped} regexp ${blockType}`;
        regexpLines.push(line);
    }

    const allLines = lines.concat(bannedLines).concat(regexpLines);
    const exportTextArea: HTMLTextAreaElement = document.getElementById('exportTextArea') as HTMLTextAreaElement;

    exportTextArea.value = `${allLines.join('\n')}\n`;
}

document.getElementById('exportButton')!.addEventListener('click', exportClicked);
