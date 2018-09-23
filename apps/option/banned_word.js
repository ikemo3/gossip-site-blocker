class BannedWords {
    constructor() {
        this.addButton = document.getElementById("bannedWordAddButton");
        this.addText = document.getElementById("bannedWordAddText");
        this.wordList = document.getElementById("bannedWordList");
        this.addButton.addEventListener("click", (async () => {
            const word = this.addText.value;
            if (word === "") {
                return;
            }
            const added = await BannedWordRepository.add(word);
            if (added) {
                Logger.debug("add to Banned Words", word);
                this.createWidget({ keyword: word });
            }
            this.addText.value = "";
        }));
    }
    clear() {
        this.wordList.innerHTML = "";
    }
    async load() {
        const words = await BannedWordRepository.load();
        this.wordList.innerHTML = "";
        for (const word of words) {
            this.createWidget(word);
        }
    }
    createWidget(word) {
        const wordDiv = document.createElement("div");
        const input = document.createElement("input");
        input.type = "text";
        input.value = word.keyword;
        input.readOnly = true;
        wordDiv.appendChild(input);
        const deleteButton = document.createElement("input");
        deleteButton.type = "button";
        deleteButton.value = chrome.i18n.getMessage("bannedWordDeleteButton");
        deleteButton.addEventListener("click", (this.deleteKeyword.bind(this, word.keyword, wordDiv)));
        wordDiv.appendChild(deleteButton);
        const br = document.createElement("br");
        wordDiv.appendChild(br);
        this.wordList.appendChild(wordDiv);
    }
    async deleteKeyword(keyword, wordDiv) {
        await BannedWordRepository.delete(keyword);
        this.wordList.removeChild(wordDiv);
    }
}
let bannedWords;
(async () => {
    bannedWords = new BannedWords();
    await bannedWords.load();
})();
//# sourceMappingURL=banned_word.js.map