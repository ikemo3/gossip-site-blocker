class BlockDialog {
    constructor(mediator, url) {
        this.mediator = mediator;
        this.background = this.createBackground(url);
        document.body.appendChild(this.background);
    }
    createBackground(url) {
        const background = document.createElement("div");
        background.classList.add("block-dialog-background");
        // create child element.
        const dialog = this.createDialog(url);
        background.appendChild(dialog);
        return background;
    }
    createDialog(url) {
        const dialog = document.createElement("div");
        dialog.classList.add("block-dialog");
        // create child element.
        const urlRadioDiv = this.createRadioDiv(url);
        dialog.appendChild(urlRadioDiv);
        const blockTypeDiv = this.createBlockTypeDiv();
        dialog.appendChild(blockTypeDiv);
        const buttonDiv = this.createButtonDiv();
        dialog.appendChild(buttonDiv);
        return dialog;
    }
    createRadioDiv(url) {
        const urlRadioDiv = document.createElement("div");
        urlRadioDiv.classList.add("block-dialog-url-radios");
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
    createRadioButtons(url) {
        const blockDomainDiv = BlockDialog.createBlockDomainRadio(DOMUtils.getHostName(url));
        const blockUrlDiv = BlockDialog.createBlockUrlRadio(DOMUtils.removeProtocol(url));
        const blockCustomDiv = this.createBlockCustomRadio(DOMUtils.removeProtocol(url));
        return [blockDomainDiv, blockUrlDiv, blockCustomDiv];
    }
    static createBlockDomainRadio(value) {
        const div = document.createElement("div");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "block-url-type";
        radio.checked = true;
        radio.value = value;
        radio.id = "blocker-dialog-domain-radio";
        const textLabel = document.createElement("label");
        textLabel.htmlFor = "blocker-dialog-domain-radio";
        textLabel.textContent = chrome.i18n.getMessage("blockThisDomainWithUrl", value);
        div.appendChild(radio);
        div.appendChild(textLabel);
        return div;
    }
    static createBlockUrlRadio(value) {
        const div = document.createElement("div");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "block-url-type";
        radio.value = value;
        radio.id = "blocker-dialog-url-radio";
        const textLabel = document.createElement("label");
        textLabel.htmlFor = "blocker-dialog-url-radio";
        textLabel.textContent = chrome.i18n.getMessage("blockThisPageWithUrl", decodeURI(value));
        div.appendChild(radio);
        div.appendChild(textLabel);
        return div;
    }
    createBlockCustomRadio(value) {
        const div = document.createElement("div");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "block-url-type";
        radio.value = "custom";
        radio.id = "blocker-dialog-custom-radio";
        this.customRadio = radio;
        const textLabel = document.createElement("label");
        textLabel.htmlFor = "blocker-dialog-custom-radio";
        textLabel.textContent = chrome.i18n.getMessage("customRadioText");
        const br = document.createElement("br");
        const urlText = document.createElement("input");
        urlText.type = "text";
        urlText.size = 100;
        urlText.value = value;
        urlText.disabled = true;
        this.urlText = urlText;
        div.appendChild(radio);
        div.appendChild(textLabel);
        div.appendChild(br);
        div.appendChild(urlText);
        return div;
    }
    createBlockTypeDiv() {
        const blockTypeDiv = document.createElement("div");
        const select = document.createElement("select");
        select.classList.add("block-dialog-type-select");
        const soft = document.createElement("option");
        soft.setAttribute("value", "soft");
        soft.textContent = chrome.i18n.getMessage("softBlock");
        const hard = document.createElement("option");
        hard.setAttribute("value", "hard");
        hard.textContent = chrome.i18n.getMessage("hardBlock");
        select.appendChild(soft);
        select.appendChild(hard);
        this.blockTypeSelect = select;
        blockTypeDiv.appendChild(select);
        return blockTypeDiv;
    }
    createButtonDiv() {
        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("block-dialog-buttons");
        // create child elements(buttons)
        const buttonList = this.createButtons();
        buttonList.forEach((button) => {
            buttonDiv.appendChild(button);
        });
        return buttonDiv;
    }
    cancel() {
        // remove background
        this.background.parentElement.removeChild(this.background);
    }
    block() {
        const selected = document.querySelector('input[name="block-url-type"]:checked');
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
        this.mediator.blockPage(url, blockType);
        // remove background.
        this.background.parentElement.removeChild(this.background);
    }
    createButtons() {
        const cancelButton = document.createElement("input");
        cancelButton.type = "button";
        cancelButton.value = chrome.i18n.getMessage("cancelButtonLabel");
        cancelButton.classList.add("blocker-secondary-button");
        cancelButton.addEventListener("click", this.cancel.bind(this));
        const blockButton = document.createElement("input");
        blockButton.type = "button";
        blockButton.value = chrome.i18n.getMessage("blockButtonLabel");
        blockButton.classList.add("blocker-primary-button");
        blockButton.addEventListener("click", this.block.bind(this));
        return [cancelButton, blockButton];
    }
}
//# sourceMappingURL=dialog.js.map