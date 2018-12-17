async function importClicked() {
    // noinspection JSValidateTypes
    /**
     * @type {HTMLTextAreaElement}
     */
    const textArea = document.getElementById("importTextArea");
    const text = textArea.value;
    const lines = text.split("\n").filter((line) => line !== "");
    const blockList = lines.map((line) => {
        const cols = line.split(" ");
        switch (cols.length) {
            case 1:
                // url only
                return { url: cols[0], block_type: "soft" };
            case 2:
            default:
                const type = cols[1];
                if (type !== "hard" && type !== "soft") {
                    return undefined;
                }
                // url + soft/hard
                return { url: cols[0], block_type: type };
        }
    }).filter((block) => block !== undefined);
    await BlockedSitesRepository.addAll(blockList);
    const bannedWordList = lines.map((line) => lineToBannedWord(line))
        .filter((banned) => banned !== undefined);
    await BannedWordRepository.addAll(bannedWordList);
    alert(chrome.i18n.getMessage("importCompleted"));
}
function lineToBannedWord(line) {
    const cols = line.split(" ");
    if (cols.length === 1) {
        return undefined;
    }
    const type = cols[1];
    if (type === "banned") {
        const word = cols[0].replace("+", " ");
        const blockType = $.toBlockType(cols[2]);
        const target = $.toBannedTarget(cols[3]);
        return { keyword: word, blockType, target };
    }
}
document.getElementById("importButton").addEventListener("click", importClicked);
//# sourceMappingURL=import.js.map