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
    constructor(mediator: BlockedSiteOption) {
        this.mediator = mediator;

        const input = document.createElement('input');
        input.setAttribute('type', 'button');
        input.setAttribute('value', chrome.i18n.getMessage('UpdateUrl'));
        input.addEventListener('click', this.onclick.bind(this));
        this.element = input;
    }

    public async onclick() {
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
