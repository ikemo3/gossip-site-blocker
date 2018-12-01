class BlockChangeAnchorDialog {
    private readonly mediator: BlockMediator;
    private readonly background: HTMLDivElement;
    private readonly reason: string | null;
    private readonly url: string;

    constructor(mediator: BlockMediator, url: string, reason: string | null) {
        this.mediator = mediator;
        this.url = url;

        const background = $.div("block-dialog-background");
        this.background = background;

        const dialog = $.div("block-dialog");
        const explanation = $.message("blockChangeExplanation");
        const byUrl = $.message("byUrl");
        dialog.innerHTML = `${explanation}<br/>${byUrl}<br/>URL: ${reason}`;

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

    private cancel() {
        this.closeDialog();
    }

    private async toHard() {
        await this.mediator.toHard(this.reason!);
        this.closeDialog();
    }

    private async unblock() {
        await this.mediator.unblock(this.reason!);
        this.closeDialog();
    }

    private closeDialog() {
        // remove background
        $.removeSelf(this.background);
    }
}
