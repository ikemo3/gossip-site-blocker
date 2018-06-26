const softBlockList = document.getElementById("softBlockList");
const hardBlockList = document.getElementById("hardBlockList");
const clearButton = document.getElementById("clearButton");

// noinspection JSValidateTypes
/**
 * @type {HTMLInputElement}
 */
const developerCheckbox = document.getElementById("developerCheckbox");

/**
 * URLフィールド
 */
class BlockedSiteUrlField {
    /**
     *
     * @param {BlockedSiteOption} mediator
     * @param {string} url
     */
    constructor(mediator, url) {
        // this.mediator = mediator;

        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("size", "100");
        this.element = input;

        // URLの設定
        this.setUrl(url);
    }

    getElement() {
        return this.element;
    }

    value() {
        return this.element.getAttribute("data-value");
    }

    getInputValue() {
        return this.element.value;
    }

    toHard() {
        // 何もしない
    }

    toSoft() {
        // 何もしない
    }

    setUrl(url) {
        this.element.setAttribute("data-value", url);
        this.element.value = url;
    }
}

/**
 * URL変更ボタン
 */
class BlockedSiteEditButton {
    /**
     *
     * @param {BlockedSiteOption} mediator
     */
    constructor(mediator) {
        this.mediator = mediator;

        const input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("value", chrome.i18n.getMessage("UpdateUrl"));
        input.addEventListener("click", this.onclick.bind(this));
        this.element = input;
    }

    async onclick(ignore) {
        await this.mediator.editUrl()
    }

    getElement() {
        return this.element;
    }

    toHard() {
        // 何もしない
    }

    toSoft() {
        // 何もしない
    }
}

/**
 * 削除ボタン
 */
class BlockedSiteDeleteButton {
    /**
     *
     * @param {BlockedSiteOption} mediator
     * @param {string} state
     */
    constructor(mediator, state) {
        this.mediator = mediator;

        const input = document.createElement("input");
        input.setAttribute("type", "button");
        input.setAttribute("value", chrome.i18n.getMessage("deleteUrl"));
        input.addEventListener("click", this.onclick.bind(this));
        this.element = input;

        // 状態の設定
        this.setState(state);
    }

    async onclick(ignore) {
        await this.mediator.deleteUrl();
    }

    getElement() {
        return this.element;
    }

    setState(state) {
        if (state === "hard") {
            this.toHard();
        } else {
            this.toSoft();
        }
    }

    toHard() {
        // ボタンを無効化
        this.element.setAttribute("disabled", "true");
    }

    toSoft() {
        // ボタンを有効化
        this.element.removeAttribute("disabled");
    }
}

class BlockedSiteStateButton {
    /**
     *
     * @param {BlockedSiteOption} mediator
     * @param {string} state
     */
    constructor(mediator, state) {
        this.mediator = mediator;

        const input = document.createElement("input");
        input.setAttribute("type", "button");
        this.element = input;

        // 状態の設定
        this.setState(state);
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;

        // ラベルの更新
        this.updateLabel(state);

        // ハンドラの更新
        this.updateBlockTypeHandler();
    }

    updateBlockTypeHandler() {
        // ハンドラを削除
        if (this.handler) {
            this.element.removeEventListener("click", this.handler);
            this.handler = null;
        }

        if (this.state === "soft") {
            this.handler = this.mediator.toHard.bind(this.mediator);
        } else {
            this.handler = this.mediator.toSoft.bind(this.mediator);
        }

        // ハンドラを設定
        if (this.handler) {
            this.element.addEventListener("click", this.handler);
        }
    }

    updateLabel(state) {
        if (state === "soft") {
            this.element.setAttribute("value", chrome.i18n.getMessage("changeToHardBlock"));
        } else {
            this.element.setAttribute("value", chrome.i18n.getMessage("changeToSoftBlock"));
        }
    }

    toHard() {
        this.setState("hard");
    }

    toSoft() {
        this.setState("soft");
    }

    getElement() {
        return this.element;
    }
}

/**
 * @property {BlockedSite} blockedSite
 * @property {BlockedSiteUrlField} urlField
 * @property {BlockedSiteEditButton} editButton
 */
class BlockedSiteOption {
    constructor(blockedSite) {
        // Colleagueの作成
        this.urlField = new BlockedSiteUrlField(this, blockedSite.getUrl());
        this.editButton = new BlockedSiteEditButton(this);
        this.stateButton = new BlockedSiteStateButton(this, blockedSite.getState());
        this.deleteButton = new BlockedSiteDeleteButton(this, blockedSite.getState());

        // 全ての入力フィールドを囲むtr要素を作成
        const tr = document.createElement("tr");
        tr.appendChild(document.createElement("td")).appendChild(this.urlField.getElement());
        tr.appendChild(document.createElement("td")).appendChild(this.editButton.getElement());
        tr.appendChild(document.createElement("td")).appendChild(this.stateButton.getElement());
        tr.appendChild(document.createElement("td")).appendChild(this.deleteButton.getElement());
        this.element = tr;
    }

    getElement() {
        return this.element;
    }

    getUrl() {
        return this.urlField.value();
    }

    getState() {
        return this.stateButton.getState();
    }

    setState(state) {
        switch (state) {
            case "soft":
                // Colleagueに送信
                this.urlField.toSoft();
                this.editButton.toSoft();
                this.stateButton.toSoft();
                this.deleteButton.toSoft();

                break;
            case "hard":
                // Colleagueに送信
                this.urlField.toHard();
                this.editButton.toHard();
                this.stateButton.toHard();
                this.deleteButton.toHard();

                break;
        }
    }

    setUrl(url) {
        this.urlField.setUrl(url);
    }

    async toHard(ignore) {
        await BlockedSitesRepository.toHard(this.getUrl());

        // 状態更新
        this.setState("hard");

        Logger.debug("Changed to hard-block.", this.getUrl());
    }

    async toSoft(ignore) {
        await BlockedSitesRepository.toSoft(this.getUrl());

        // 状態更新
        this.setState("soft");

        Logger.debug("Changed to soft-block.", this.getUrl());
    }

    async editUrl(ignore) {
        const beforeUrl = this.urlField.value();
        const afterUrl = this.urlField.getInputValue();
        await BlockedSitesRepository.edit(beforeUrl, afterUrl);

        // URL更新
        this.setUrl(afterUrl);

        Logger.debug(`Change URL: ${beforeUrl} => ${afterUrl}`);
    }

    async deleteUrl() {
        await BlockedSitesRepository.del(this.getUrl());

        // 画面から削除
        this.element.parentElement.removeChild(this.element);

        Logger.debug("Delete URL: " + this.getUrl());
    }
}

async function show_lists() {
    const sites = await BlockedSitesRepository.load();

    // 一旦クリアしてから追加
    softBlockList.innerHTML = "";
    hardBlockList.innerHTML = "";

    const softTable = document.createElement("table");
    const hardTable = document.createElement("table");
    for (let site of sites) {
        const option = new BlockedSiteOption(site);

        if (option.getState() === "soft") {
            softTable.appendChild(option.getElement());
        } else {
            hardTable.appendChild(option.getElement());
        }
    }

    softBlockList.appendChild(softTable);
    hardBlockList.appendChild(hardTable);
}

async function clear() {
    if (confirm(chrome.i18n.getMessage("clearConfirm"))) {
        await BlockedSitesRepository.clear();

        alert(chrome.i18n.getMessage("clearDone"));

        // 全てクリア
        softBlockList.innerHTML = "";
    }
}

// イベントをバインド
clearButton.addEventListener("click", clear);

document.addEventListener('DOMContentLoaded', async (ignore) => {
    // リストの表示
    await show_lists();

    // 開発者モードの設定
    developerCheckbox.checked = await OptionRepository.isDeveloperMode();
});

developerCheckbox.addEventListener("click", async function (event) {
    const checkbox = event.target;

    // 設定の書き込み
    await OptionRepository.setDeveloperMode(checkbox.checked);
});
