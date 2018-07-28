const softBlockList = document.getElementById("softBlockList");
const hardBlockList = document.getElementById("hardBlockList");
const clearButton = document.getElementById("clearButton");

// noinspection JSValidateTypes
/**
 * @type {HTMLInputElement}
 */
const developerCheckbox = document.getElementById("developerCheckbox");

/**
 * URL field
 */
class BlockedSiteUrlField {
    /**
     *
     * @param {BlockedSiteOption} mediator
     * @param {string} url
     */
    constructor(mediator, url) {
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("size", "100");
        this.element = input;

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
        // do nothing
    }

    toSoft() {
        // do nothing
    }

    setUrl(url) {
        this.element.setAttribute("data-value", url);
        this.element.value = url;
    }
}

/**
 * Change URL button
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
        // do nothing
    }

    toSoft() {
        // do nothing
    }
}

/**
 * Delete button
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
        // disable button.
        this.element.setAttribute("disabled", "true");
    }

    toSoft() {
        // enable button.
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

        this.setState(state);
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;

        this.updateLabel(state);

        this.updateBlockTypeHandler();
    }

    updateBlockTypeHandler() {
        // remove handler
        if (this.handler) {
            this.element.removeEventListener("click", this.handler);
            this.handler = null;
        }

        if (this.state === "soft") {
            this.handler = this.mediator.toHard.bind(this.mediator);
        } else {
            this.handler = this.mediator.toSoft.bind(this.mediator);
        }

        // set handler
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
        // create Colleague
        this.urlField = new BlockedSiteUrlField(this, blockedSite.getUrl());
        this.editButton = new BlockedSiteEditButton(this);
        this.stateButton = new BlockedSiteStateButton(this, blockedSite.getState());
        this.deleteButton = new BlockedSiteDeleteButton(this, blockedSite.getState());

        // Create tr element surrounding all input fields.
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
                // send to Colleagues.
                this.urlField.toSoft();
                this.editButton.toSoft();
                this.stateButton.toSoft();
                this.deleteButton.toSoft();

                break;
            case "hard":
                // send to Colleagues.
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

        this.setState("hard");

        Logger.debug("Changed to hard-block.", this.getUrl());
    }

    async toSoft(ignore) {
        await BlockedSitesRepository.toSoft(this.getUrl());

        this.setState("soft");

        Logger.debug("Changed to soft-block.", this.getUrl());
    }

    async editUrl(ignore) {
        const beforeUrl = this.urlField.value();
        const afterUrl = this.urlField.getInputValue();
        await BlockedSitesRepository.edit(beforeUrl, afterUrl);

        this.setUrl(afterUrl);

        Logger.debug(`Change URL: ${beforeUrl} => ${afterUrl}`);
    }

    async deleteUrl() {
        await BlockedSitesRepository.del(this.getUrl());

        this.element.parentElement.removeChild(this.element);

        Logger.debug("Delete URL: " + this.getUrl());
    }
}

async function show_lists() {
    const sites = await BlockedSitesRepository.load();

    // Add after clear.
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

        // clear all.
        softBlockList.innerHTML = "";
    }
}

// bind event.
clearButton.addEventListener("click", clear);

document.addEventListener('DOMContentLoaded', async (ignore) => {
    await show_lists();

    developerCheckbox.checked = await OptionRepository.isDeveloperMode();
});

developerCheckbox.addEventListener("click", async function (event) {
    const checkbox = event.target;

    await OptionRepository.setDeveloperMode(checkbox.checked);
});
