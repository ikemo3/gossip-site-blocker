class RegExpList {
    constructor(patternList) {
        const regexpList = document.getElementById("regexpList");
        for (const pattern of patternList) {
            const itemDiv = this.createItem(pattern);
            regexpList.appendChild(itemDiv);
        }
        this.addDiv = this.createAddItem();
        regexpList.appendChild(this.addDiv);
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
    createAddItem() {
        const div = $.div();
        const input = $.textField("");
        this.addInput = input;
        const addButton = $.button($.message("regexpAddButton"));
        $.onclick(addButton, this.addItem.bind(this));
        div.appendChild(input);
        div.appendChild(addButton);
        return div;
    }
    async addItem() {
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
            const item = await this.createItem({ pattern });
            $.insertBefore(item, this.addDiv);
        }
        // clear text
        this.addInput.value = "";
    }
    async deleteItem(pattern, div) {
        await RegExpRepository.delete(pattern);
        $.removeSelf(div);
    }
}
//# sourceMappingURL=regexp.js.map