import BlockedSiteOption from './blocked_site_option';

/**
 * Change URL button
 */
export default class BlockedSiteEditButton {
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

    public async onclick(): Promise<void> {
        await this.mediator.editUrl();
    }

    public getElement(): Element {
        return this.element;
    }

    public toHard(): void {
        // do nothing
    }

    public toSoft(): void {
        // do nothing
    }
}
