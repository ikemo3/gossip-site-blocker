async function exportClicked() {
    const sites = await BlockedSitesRepository.load();

    let lines = [];
    for (const site of sites) {
        const line = `${site.url} ${site.block_type}`;
        lines.push(line);
    }

    // noinspection JSValidateTypes
    /**
     * @type HTMLTextAreaElement
     */
    const exportTextArea = document.getElementById('exportTextArea');

    exportTextArea.value = lines.join("\n") + "\n";
}

document.getElementById('exportButton').addEventListener('click', exportClicked);
