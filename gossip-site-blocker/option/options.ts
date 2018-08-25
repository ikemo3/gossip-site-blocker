const softBlockList = document.getElementById("softBlockList");
const hardBlockList = document.getElementById("hardBlockList");
const clearButton = document.getElementById("clearButton");

// noinspection JSValidateTypes
/**
 * @type {HTMLInputElement}
 */
const developerCheckbox = document.getElementById("developerCheckbox") as HTMLInputElement;

/**
 * URL field
 */
class BlockedSiteUrlField {
    public element: HTMLInputElement;

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

    public getElement() {
        return this.element;
    }

    public value() {
        return this.element.getAttribute("data-value");
    }

    public getInputValue() {
        return this.element.value;
    }

    public toHard() {
        // do nothing
    }

    public toSoft() {
        // do nothing
    }

    public setUrl(url) {
        this.element.setAttribute("data-value", url);
        this.element.value = url;
    }
}

/**
 * Change URL button
 */
class BlockedSiteEditButton {
    public element: HTMLInputElement;
    public mediator: BlockedSiteOption;

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

    public async onclick(ignore) {
        await this.mediator.editUrl();
    }

    public getElement() {
        return this.element;
    }

    public toHard() {
        // do nothing
    }

    public toSoft() {
        // do nothing
    }
}

/**
 * Delete button
 */
class BlockedSiteDeleteButton {
    public element: HTMLInputElement;
    public mediator: BlockedSiteOption;

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

    public async onclick(ignore) {
        await this.mediator.deleteUrl();
    }

    public getElement() {
        return this.element;
    }

    public setState(state) {
        if (state === "hard") {
            this.toHard();
        } else {
            this.toSoft();
        }
    }

    public toHard() {
        // disable button.
        this.element.setAttribute("disabled", "true");
    }

    public toSoft() {
        // enable button.
        this.element.removeAttribute("disabled");
    }
}

class BlockedSiteStateButton {
    public element: HTMLInputElement;
    public mediator: BlockedSiteOption;
    public state: string;
    public handler: any;

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

    public getState() {
        return this.state;
    }

    public setState(state) {
        this.state = state;

        this.updateLabel(state);

        this.updateBlockTypeHandler();
    }

    public updateBlockTypeHandler() {
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

    public updateLabel(state) {
        if (state === "soft") {
            this.element.setAttribute("value", chrome.i18n.getMessage("changeToHardBlock"));
        } else {
            this.element.setAttribute("value", chrome.i18n.getMessage("changeToSoftBlock"));
        }
    }

    public toHard() {
        this.setState("hard");
    }

    public toSoft() {
        this.setState("soft");
    }

    public getElement() {
        return this.element;
    }
}

/**
 * @property {BlockedSite} blockedSite
 * @property {BlockedSiteUrlField} urlField
 * @property {BlockedSiteEditButton} editButton
 */
class BlockedSiteOption {
    public urlField: BlockedSiteUrlField;
    public editButton: BlockedSiteEditButton;
    public stateButton: BlockedSiteStateButton;
    public deleteButton: BlockedSiteDeleteButton;
    public element: HTMLTableRowElement;

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

    public getElement() {
        return this.element;
    }

    public getUrl() {
        return this.urlField.value();
    }

    public getState() {
        return this.stateButton.getState();
    }

    public setState(state) {
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

    public setUrl(url) {
        this.urlField.setUrl(url);
    }

    public async toHard(ignore) {
        await BlockedSitesRepository.toHard(this.getUrl());

        this.setState("hard");

        Logger.debug("Changed to hard-block.", this.getUrl());
    }

    public async toSoft(ignore) {
        await BlockedSitesRepository.toSoft(this.getUrl());

        this.setState("soft");

        Logger.debug("Changed to soft-block.", this.getUrl());
    }

    public async editUrl() {
        const beforeUrl = this.urlField.value();
        const afterUrl = this.urlField.getInputValue();
        await BlockedSitesRepository.edit(beforeUrl, afterUrl);

        this.setUrl(afterUrl);

        Logger.debug(`Change URL: ${beforeUrl} => ${afterUrl}`);
    }

    public async deleteUrl() {
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
    for (const site of sites) {
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
        hardBlockList.innerHTML = "";
    }
}

// bind event.
clearButton.addEventListener("click", clear);

document.addEventListener("DOMContentLoaded", async (ignore) => {
    await show_lists();

    developerCheckbox.checked = await OptionRepository.isDeveloperMode();
});

developerCheckbox.addEventListener("click", async function(event) {
    const checkbox = event.target as HTMLInputElement;

    await OptionRepository.setDeveloperMode(checkbox.checked);
});
