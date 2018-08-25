async function importClicked(ignore) {
    // noinspection JSValidateTypes
    /**
     * @type {HTMLTextAreaElement}
     */
    const textArea = document.getElementById("importTextArea") as HTMLTextAreaElement;
    const text = textArea.value;
    const blockList = text.split("\n").filter((line) => line !== "").map((line) => {
        const cols = line.split(" ");
        switch (cols.length) {
            case 1:
                // url only
                return {url: cols[0], block_type: "soft"};
            case 2:
            default:
                // url + soft/hard
                const type = cols[1] === "hard" ? "hard" : "soft";
                return {url: cols[0], block_type: type};
        }
    });

    await BlockedSitesRepository.addAll(blockList);

    alert(chrome.i18n.getMessage("importCompleted"));
}

document.getElementById("importButton").addEventListener("click", importClicked);
