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
    async toHard() {
        await BlockedSitesRepository.toHard(this.getUrl());
        this.setState("hard");
        Logger.debug("Changed to hard-block.", this.getUrl());
    }
    async toSoft() {
        await BlockedSitesRepository.toSoft(this.getUrl());
        this.setState("soft");
        Logger.debug("Changed to soft-block.", this.getUrl());
    }
    async editUrl() {
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
//# sourceMappingURL=blocked_site_option.js.map