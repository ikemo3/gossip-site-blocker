/**
 * Block target element.
 *
 * @property element {Element}
 * @property id {string}
 */
class BlockTarget {
    public element: Element;
    public id: string;

    /**
     *
     * @param element {Element} block target element
     * @param url {string}
     * @param id {string}
     * @param state {"none"|"soft"|"hard"}
     */
    constructor(element, url, id, state) {
        this.element = element;
        this.setUrl(url);

        // set id.
        this.id = id;
        this.element.setAttribute("id", id);

        this.setState(state);
    }

    public getDOMElement() {
        return this.element;
    }

    /**
     * @private
     * @param url {string}
     */
    public setUrl(url) {
        this.element.setAttribute("data-blocker-url", url);
    }

    /**
     * @returns {string}
     */
    public getUrl() {
        return this.element.getAttribute("data-blocker-url");
    }

    /**
     *
     * @param state {"none"|"soft"|"hard"}
     */
    public setState(state) {
        this.element.setAttribute("data-blocker-state", state);

        switch (state) {
            case "hard":
                // When it is hard it should not reach here.
                // noinspection TsLint
                console.error("Program Error, state=hard");
                break;

            case "soft":
                this.hide();
                break;

            default:
                this.show();
                break;
        }
    }

    public block(url) {
        this.setUrl(url);
        this.hide();
    }

    public show() {
        this.element.removeAttribute("data-blocker-display");
    }

    public hide() {
        this.element.setAttribute("data-blocker-display", "none");
    }

    public unhide() {
        this.element.setAttribute("data-blocker-display", "unhide");
    }
}
