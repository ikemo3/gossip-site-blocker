class BlockChangeAnchorDialog {
    constructor(mediator, url, reason) {
        this.mediator = mediator;
        this.url = url;
        const background = $.div("block-dialog-background");
        this.background = background;
        const dialog = $.div("block-dialog");
        const explanation = $.message("blockChangeExplanation");
        const explanationDiv = $.div();
        explanationDiv.textContent = explanation;
        const reasonDiv = $.div();
        reasonDiv.textContent = "URL: " + reason;
        dialog.appendChild(explanationDiv);
        dialog.appendChild(reasonDiv);
        const buttonsDiv = $.div("block-dialog-buttons");
        const cancelButton = $.button($.message("cancelButtonLabel"), "blocker-secondary-button");
        $.onclick(cancelButton, this.cancel.bind(this));
        const unblockButton = $.button($.message("unblock"), "blocker-secondary-button");
        $.onclick(unblockButton, this.unblock.bind(this));
        const hardBlockButton = $.button($.message("hardBlock"), "blocker-secondary-button");
        $.onclick(hardBlockButton, this.toHard.bind(this));
        document.body.appendChild(background);
        background.appendChild(dialog);
        dialog.appendChild(buttonsDiv);
        buttonsDiv.appendChild(cancelButton);
        buttonsDiv.appendChild(unblockButton);
        buttonsDiv.appendChild(hardBlockButton);
        this.reason = reason;
    }
    cancel() {
        this.closeDialog();
    }
    async toHard() {
        await this.mediator.toHard(this.reason);
        this.closeDialog();
    }
    async unblock() {
        await this.mediator.unblock(this.reason);
        this.closeDialog();
    }
    closeDialog() {
        // remove background
        $.removeSelf(this.background);
    }
}
//# sourceMappingURL=block_change_anchor_dialog.js.map