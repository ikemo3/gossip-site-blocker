class RegExpList {
    constructor(patternList) {
        this.regexpList = document.getElementById("regexpList");
        for (const pattern of patternList) {
            const itemDiv = this.createItem(pattern);
            this.regexpList.appendChild(itemDiv);
        }
        this.addText = document.getElementById("regexpAddText");
        this.addButton = document.getElementById("regexpAddButton");
        $.onclick(this.addButton, this.addItem.bind(this));
    }
    createItem(item) {
        const div = $.div();
        const input = $.textField(item.pattern);
        input.readOnly = true;
        const delButton = $.button($.message("regexpDeleteButton"));
        $.onclick(delButton, this.deleteItem.bind(this, item.pattern, div));
        div.appendChild(input);
        div.appendChild(delButton);
        return div;
    }
    async addItem() {
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
            const item = await this.createItem({ pattern });
            this.regexpList.appendChild(item);
        }
        // clear text
        this.addText.value = "";
    }
    async deleteItem(pattern, div) {
        await RegExpRepository.delete(pattern);
        $.removeSelf(div);
    }
}
//# sourceMappingURL=regexp.js.map