class RegExpList {
    constructor() {
        this.regexpList = document.getElementById("regexpList");
        this.addText = document.getElementById("regexpAddText");
        this.addButton = document.getElementById("regexpAddButton");
        $.onclick(this.addButton, this.addItem.bind(this));
    }
    async load() {
        const patternList = await RegExpRepository.load();
        for (const pattern of patternList) {
            const itemDiv = this.createItem(pattern);
            this.regexpList.appendChild(itemDiv);
        }
    }
    clear() {
        this.regexpList.innerHTML = "";
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
let regexpList;
(async () => {
    regexpList = new RegExpList();
    await regexpList.load();
})();
//# sourceMappingURL=regexp.js.map