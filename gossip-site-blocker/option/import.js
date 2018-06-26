async function importClicked(ignore) {
    // noinspection JSValidateTypes
    /**
     * テキストエリア
     * @type {HTMLTextAreaElement}
     */
    const textArea = document.getElementById('importTextArea');
    const text = textArea.value;
    const urlList = text.split("\n").filter(url => url !== "");

    // 保存
    await BlockedSitesRepository.addAll(urlList);

    alert(chrome.i18n.getMessage('importCompleted'));
}

document.getElementById('importButton').addEventListener('click', importClicked);
