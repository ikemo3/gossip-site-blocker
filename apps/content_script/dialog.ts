class BlockDialog {
    public mediator: BlockMediator;
    public background: HTMLDivElement;
    public urlText: HTMLInputElement;
    public customRadio: HTMLInputElement;
    public blockTypeSelect: HTMLSelectElement;

    constructor(mediator: BlockMediator, url: string, defaultBlockType: string) {
        this.mediator = mediator;

        this.background = this.createBackground(url, defaultBlockType);
        document.body.appendChild(this.background);
    }

    public createBackground(url: string, defaultBlockType: string) {
        const background = $.div("block-dialog-background");

        // create child element.
        const dialog = this.createDialog(url, defaultBlockType);
        background.appendChild(dialog);

        return background;
    }

    public createDialog(url: string, defaultBlockType: string) {
        const dialog = $.div("block-dialog");

        // create child element.
        const urlRadioDiv = this.createRadioDiv(url);
        dialog.appendChild(urlRadioDiv);

        const blockTypeDiv = this.createBlockTypeDiv(defaultBlockType);
        dialog.appendChild(blockTypeDiv);

        const buttonDiv = this.createButtonDiv();
        dialog.appendChild(buttonDiv);

        return dialog;
    }

    public createRadioDiv(url: string) {
        const urlRadioDiv = $.div("block-dialog-url-radios");
        urlRadioDiv.addEventListener("click", (ignore) => {
            // If the custom radio button is selected, turn on the URL text, if not, reverse it.
            this.urlText.disabled = !this.customRadio.checked;
        });

        // create child element(buttons).
        const buttonList = this.createRadioButtons(url);
        buttonList.forEach((button) => {
            urlRadioDiv.appendChild(button);
        });

        return urlRadioDiv;
    }

    public createRadioButtons(url: string) {
        const blockDomainDiv = BlockDialog.createBlockDomainRadio(DOMUtils.getHostName(url));
        const blockUrlDiv = BlockDialog.createBlockUrlRadio(DOMUtils.removeProtocol(url));
        const blockCustomDiv = this.createBlockCustomRadio(DOMUtils.removeProtocol(url));

        return [blockDomainDiv, blockUrlDiv, blockCustomDiv];
    }

    public static createBlockDomainRadio(value: string) {
        const div = $.div();

        const radio = $.radio("block-url-type", value, "blocker-dialog-domain-radio");
        radio.checked = true;

        const textLabel = $.label($.message("blockThisDomainWithUrl", value), "blocker-dialog-domain-radio");

        div.appendChild(radio);
        div.appendChild(textLabel);

        return div;
    }

    public static createBlockUrlRadio(value: string) {
        const div = $.div();

        const radio = $.radio("block-url-type", value, "blocker-dialog-url-radio");

        const textLabel = $.label($.message("blockThisPageWithUrl", decodeURI(value)), "blocker-dialog-url-radio");

        div.appendChild(radio);
        div.appendChild(textLabel);

        return div;
    }

    public createBlockCustomRadio(value: string) {
        const div = $.div();

        const radio = $.radio("block-url-type", "custom", "blocker-dialog-custom-radio");
        this.customRadio = radio;

        const textLabel = $.label($.message("customRadioText"), "blocker-dialog-custom-radio");

        const br = $.br();

        const urlText = $.textField(100, value);
        urlText.disabled = true;

        this.urlText = urlText;

        div.appendChild(radio);
        div.appendChild(textLabel);
        div.appendChild(br);
        div.appendChild(urlText);

        return div;
    }

    public createBlockTypeDiv(defaultBlockType: string) {
        const blockTypeDiv = $.div();
        const select = document.createElement("select");
        select.classList.add("block-dialog-type-select");

        const soft = $.option("soft", $.message("softBlock"));
        const hard = $.option("hard", $.message("hardBlock"));

        select.appendChild(soft);
        select.appendChild(hard);
        select.value = defaultBlockType;
        this.blockTypeSelect = select;

        blockTypeDiv.appendChild(select);

        return blockTypeDiv;
    }

    public createButtonDiv() {
        const buttonDiv = $.div("block-dialog-buttons");

        // create child elements(buttons)
        const buttonList = this.createButtons();
        buttonList.forEach((button) => {
            buttonDiv.appendChild(button);
        });

        return buttonDiv;
    }

    public cancel() {
        // remove background
        $.removeSelf(this.background);
    }

    public async block() {
        const selected = document.querySelector('input[name="block-url-type"]:checked') as HTMLInputElement;

        // ignore when not selected.
        if (!selected) {
            return;
        }

        let url = selected.value;

        // when 'custom', get url from text field.
        if (url === "custom") {
            url = this.urlText.value;
        }

        // get block type.
        const blockType = this.blockTypeSelect.value;

        // block page.
        await this.mediator.blockPage(url, blockType);

        // remove background.
        $.removeSelf(this.background);
    }

    public createButtons() {
        const cancelButton = $.button($.message("cancelButtonLabel"), "blocker-secondary-button");
        $.onclick(cancelButton, this.cancel.bind(this));

        const blockButton = $.button($.message("blockButtonLabel"), "blocker-primary-button");
        $.onclick(blockButton, this.block.bind(this));

        return [cancelButton, blockButton];
    }
}
