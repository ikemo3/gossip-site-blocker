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
        const escaped = word.keyword.replace(" ", "+");
        const line = `${escaped} banned`;
        bannedLines.push(line);
    }

    bannedLines.sort();

    const allLines = lines.concat(bannedLines);
    const exportTextArea: HTMLTextAreaElement = document.getElementById("exportTextArea") as HTMLTextAreaElement;

    exportTextArea.value = allLines.join("\n") + "\n";
}

document.getElementById("exportButton")!.addEventListener("click", exportClicked);
