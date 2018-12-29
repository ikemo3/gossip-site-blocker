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
        const typeSelect = document.createElement("select");
        const softOption = $.option("soft", $.message("softBlock"));
        const hardOption = $.option("hard", $.message("hardBlock"));
        typeSelect.appendChild(softOption);
        typeSelect.appendChild(hardOption);
        typeSelect.addEventListener("change", this.changeType.bind(this, item.pattern));
        typeSelect.value = item.blockType.toString();
        div.appendChild(input);
        div.appendChild(delButton);
        div.appendChild(typeSelect);
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
            const item = await this.createItem({ pattern, blockType: BlockType.SOFT });
            this.regexpList.appendChild(item);
        }
        // clear text
        this.addText.value = "";
    }
    async changeType(pattern, ev) {
        const typeSelect = ev.target;
        const index = typeSelect.selectedIndex;
        const value = typeSelect.options[index].value;
        switch (value) {
            case "soft":
                await RegExpRepository.changeType(pattern, BlockType.SOFT);
                break;
            case "hard":
                await RegExpRepository.changeType(pattern, BlockType.HARD);
                break;
        }
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