class RegExpList {
    private addDiv: HTMLDivElement;
    private addInput: HTMLInputElement;

    constructor(patternList: IRegExpItem[]) {
        const regexpList = document.getElementById("regexpList") as HTMLDivElement;

        for (const pattern of patternList) {
            const itemDiv = this.createItem(pattern);
            regexpList.appendChild(itemDiv);
        }

        this.addDiv = this.createAddItem();
        regexpList.appendChild(this.addDiv);
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

    private createAddItem(): HTMLDivElement {
        const div = $.div();
        const input = $.textField("");
        this.addInput = input;

        const addButton = $.button($.message("regexpAddButton"));
        $.onclick(addButton, this.addItem.bind(this));

        div.appendChild(input);
        div.appendChild(addButton);

        return div;
    }

    private async addItem(): Promise<void> {
        const pattern = this.addInput.value;
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
            $.insertBefore(item, this.addDiv);
        }

        // clear text
        this.addInput.value = "";
    }

    private async deleteItem(pattern: string, div: HTMLDivElement): Promise<void> {
        await RegExpRepository.delete(pattern);

        $.removeSelf(div);
    }
}
