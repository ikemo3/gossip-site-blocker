/**
 * Block target element.
 */
class BlockTarget {
    private readonly mediator: BlockMediator;
    private readonly element: Element;

    constructor(mediator: BlockMediator, element: Element, url: string, state: string) {
        this.mediator = mediator;
        this.element = element;
        this.setUrl(url);
        this.setState(state);
    }

    public remove() {
        $.removeSelf(this.element);
    }

    public getDOMElement() {
        return this.element;
    }

    public setUrl(url: string) {
        this.element.setAttribute("data-blocker-url", url);
    }

    public getUrl(): string {
        return this.element.getAttribute("data-blocker-url")!;
    }

    public setState(state: string) {
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
                this.none();
                break;
        }
    }

    public block(url: string) {
        this.setUrl(url);
        this.hide();
    }

    public none() {
        this.element.removeAttribute("data-blocker-display");
    }

    public hide() {
        this.element.setAttribute("data-blocker-display", "none");
    }

    public unhide() {
        this.element.setAttribute("data-blocker-display", "unhide");
    }
}
