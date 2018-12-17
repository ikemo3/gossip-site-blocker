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
    const words = await BannedWordRepository.load();
    for (const word of words) {
        const escaped = word.keyword.replace(" ", "+");
        const blockType = word.blockType;
        const target = word.target;
        const line = `${escaped} banned ${blockType} ${target}`;
        bannedLines.push(line);
    }
    bannedLines.sort();
    const allLines = lines.concat(bannedLines);
    const exportTextArea = document.getElementById("exportTextArea");
    exportTextArea.value = allLines.join("\n") + "\n";
}
document.getElementById("exportButton").addEventListener("click", exportClicked);
//# sourceMappingURL=export.js.map