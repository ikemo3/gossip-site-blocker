class BlockDialog {
    constructor(mediator, url) {
        this.mediator = mediator;

        this.background = this.createBackground(url);
        document.body.appendChild(this.background);
    }

    createBackground(url) {
        const background = document.createElement("div");
        background.classList.add("block-dialog-background");

        // 子要素の作成
        const dialog = this.createDialog(url);
        background.appendChild(dialog);

        return background;
    }

    createDialog(url) {
        const dialog = document.createElement("div");
        dialog.classList.add("block-dialog");

        // 子要素の作成
        const urlRadioDiv = this.createRadioDiv(url);
        dialog.appendChild(urlRadioDiv);

        const buttonDiv = this.createButtonDiv();
        dialog.appendChild(buttonDiv);

        return dialog;
    }

    createRadioDiv(url) {
        const urlRadioDiv = document.createElement("div");
        urlRadioDiv.classList.add("block-dialog-url-radios");
        urlRadioDiv.addEventListener("click", (ignore) => {
                // カスタムラジオボタンが選択されていたら、URLテキストをオンに、選択されてなければオフにする。
                this.urlText.disabled = !this.customRadio.checked;
            }
        );

        // 子要素(ボタン類)を作成
        const buttonList = this.createRadioButtons(url);
        buttonList.forEach(button => {
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

    createButtonDiv() {
        const buttonDiv = document.createElement("div");
        buttonDiv.classList.add("block-dialog-buttons");

        // 子要素(ボタン類)を作成
        const buttonList = this.createButtons();
        buttonList.forEach(button => {
            buttonDiv.appendChild(button);
        });

        return buttonDiv;
    }

    cancel(ignore) {
        // 背景を削除
        this.background.parentElement.removeChild(this.background);
    }

    block(ignore) {
        const selected = document.querySelector('input[name="block-url-type"]:checked');

        // 未選択の場合は何もしない
        if (!selected) {
            return;
        }

        let url = selected.value;

        // カスタムの場合はテキストフィールドから取得
        if (url === "custom") {
            url = this.urlText.value;
        }

        // ブロック
        this.mediator.blockPage(url);

        // 背景を削除
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
