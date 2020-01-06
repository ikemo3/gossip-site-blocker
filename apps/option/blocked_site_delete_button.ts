/**
 * Delete button
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class BlockedSiteDeleteButton {
    public element: HTMLInputElement;

    public mediator: BlockedSiteOption;

    /**
     *
     * @param {BlockedSiteOption} mediator
     * @param {string} state
     */
    constructor(mediator: BlockedSiteOption, state: string) {
        this.mediator = mediator;

        const input = document.createElement('input');
        input.setAttribute('type', 'button');
        input.setAttribute('value', chrome.i18n.getMessage('unblock'));
        input.addEventListener('click', this.onclick.bind(this));
        this.element = input;

        this.setState(state);
    }

    public async onclick(): Promise<void> {
        await this.mediator.deleteUrl();
    }

    public getElement(): Element {
        return this.element;
    }

    public setState(state: string): void {
        if (state === 'hard') {
            this.toHard();
        } else {
            this.toSoft();
        }
    }

    public toHard(): void {
        // disable button.
        this.element.setAttribute('disabled', 'true');
    }

    public toSoft(): void {
        // enable button.
        this.element.removeAttribute('disabled');
    }
}
