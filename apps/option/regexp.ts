class RegExpList {
    private readonly regexpList: HTMLDivElement;
    private readonly addText: HTMLInputElement;
    private readonly addButton: HTMLInputElement;

    constructor() {
        this.regexpList = document.getElementById("regexpList") as HTMLDivElement;
        this.addText = document.getElementById("regexpAddText") as HTMLInputElement;
        this.addButton = document.getElementById("regexpAddButton") as HTMLInputElement;
        $.onclick(this.addButton, this.addItem.bind(this));
    }

    public async load() {
        const patternList = await RegExpRepository.load();
        for (const pattern of patternList) {
            const itemDiv = this.createItem(pattern);
            this.regexpList.appendChild(itemDiv);
        }
    }

    public clear() {
        this.regexpList.innerHTML = "";
    }

    private createItem(item: IRegExpItem): HTMLDivElement {
        const div = $.div();
        const input = $.textField(item.pattern);
        input.readOnly = true;

        const delButton = $.button($.message("regexpDeleteButton"));
        $.onclick(delButton, this.deleteItem.bind(this, item.pattern, div));

        div.appendChild(input);
        div.appendChild(delButton);
        return div;
    }

    private async addItem(): Promise<void> {
        const pattern = this.addText.value;
        if (pattern === "") {
            return;
        }

        const regexp = $.regexp(pattern);
        if (regexp === null) {
            alert($.message("invalidPattern"));
            return;
        }

        const added = await RegExpRepository.add(pattern);
        if (added) {
            // add item
            const item = await this.createItem({pattern});
            this.regexpList.appendChild(item);
        }

        // clear text
        this.addText.value = "";
    }

    private async deleteItem(pattern: string, div: HTMLDivElement): Promise<void> {
        await RegExpRepository.delete(pattern);

        $.removeSelf(div);
    }
}

let regexpList: RegExpList;
(async () => {
    regexpList = new RegExpList();
    await regexpList.load();
})();
