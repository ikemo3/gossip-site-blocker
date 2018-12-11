class BannedWords {
    private addButton: HTMLInputElement;
    private addText: HTMLInputElement;
    private wordList: HTMLDivElement;

    constructor() {
        this.addButton = document.getElementById("bannedWordAddButton") as HTMLInputElement;
        this.addText = document.getElementById("bannedWordAddText") as HTMLInputElement;
        this.wordList = document.getElementById("bannedWordList") as HTMLDivElement;

        this.addButton.addEventListener("click", (async () => {
            const word = this.addText.value;
            if (word === "") {
                return;
            }

            const added: boolean = await BannedWordRepository.add(word);
            if (added) {
                Logger.debug("add to Banned Words", word);
                this.createWidget({keyword: word, blockType: BlockType.SOFT});
            }

            this.addText.value = "";
        }));
    }

    public clear() {
        this.wordList.innerHTML = "";
    }

    public async load() {
        const words: IBannedWord[] = await BannedWordRepository.load();
        this.wordList.innerHTML = "";

        for (const word of words) {
            this.createWidget(word);
        }
    }

    private createWidget(word: IBannedWord) {
        const wordDiv: HTMLElement = document.createElement("div");

        const input: HTMLInputElement = document.createElement("input");
        input.type = "text";
        input.value = word.keyword;
        input.readOnly = true;
        wordDiv.appendChild(input);

        const deleteButton: HTMLInputElement = document.createElement("input");
        deleteButton.type = "button";
        deleteButton.value = chrome.i18n.getMessage("bannedWordDeleteButton");
        deleteButton.addEventListener("click", (this.deleteKeyword.bind(this, word.keyword, wordDiv)));
        wordDiv.appendChild(deleteButton);

        const typeSelect: HTMLSelectElement = document.createElement("select");
        const softOption: HTMLOptionElement = $.option("soft", $.message("softBlock"));
        const hardOption: HTMLOptionElement = $.option("hard", $.message("hardBlock"));
        typeSelect.appendChild(softOption);
        typeSelect.appendChild(hardOption);
        typeSelect.addEventListener("change", this.changeType.bind(this, word.keyword));
        typeSelect.value = word.blockType.toString();
        wordDiv.appendChild(typeSelect);

        const br = document.createElement("br");
        wordDiv.appendChild(br);

        this.wordList.appendChild(wordDiv);
    }

    private async changeType(keyword: string, ev: Event) {
        const typeSelect: HTMLSelectElement = ev.target as HTMLSelectElement;
        const index = typeSelect.selectedIndex;
        const value = typeSelect.options[index].value;

        switch (value) {
            case "soft":
                await BannedWordRepository.changeType(keyword, BlockType.SOFT);
                break;
            case "hard":
                await BannedWordRepository.changeType(keyword, BlockType.HARD);
                break;
        }
    }

    private async deleteKeyword(keyword: string, wordDiv: HTMLDivElement) {
        await BannedWordRepository.delete(keyword);
        this.wordList.removeChild(wordDiv);
    }
}

let bannedWords: BannedWords;
(async () => {
    bannedWords = new BannedWords();
    await bannedWords.load();
})();
