const ChromeStorage = {
    async load<T>(keys: T): Promise<T> {
        // @ts-ignore
        return new Promise((resolve) => {
            chrome.storage.local.get(keys, resolve);
        });
    },

    async save<T>(items: T) {
        return new Promise((resolve) => {
            chrome.storage.local.set(items, resolve);
        });
    },

    async get(keys: any) {
        return new Promise((resolve) => {
            chrome.storage.local.get(keys, resolve);
        });
    },

    async set(items: any) {
        return new Promise((resolve) => {
            chrome.storage.local.set(items, resolve);
        });
    },
};

// noinspection TsLint
const Logger = {
    debug(message: any, ...params: any[]) {
        OptionRepository.isDeveloperMode().then((developerMode: boolean) => {
            if (developerMode) {
                // noinspection TsLint
                console.log(message, ...params);
            }
        });
    },

    log(message: any, ...params: any[]) {
        // noinspection TsLint
        console.log(message, ...params);
    },

    error(message: any, ...params: any[]) {
        // noinspection TsLint
        console.error(message, ...params);
    },
};

const DOMUtils = {
    /**
     * add element later.
     *
     * @param element
     * @param insertElement element to add.
     */
    insertAfter(element: Element, insertElement: Element) {
        element.parentElement!.insertBefore(insertElement, element.nextSibling);
    },

    /**
     * get hostname from URL string.
     *
     * example: https://example.com/path -> example.com
     * @param {string} url URL string
     * @return {string} hostname
     */
    getHostName(url: string): string {
        const tmp = document.createElement("a");
        tmp.href = url;
        return tmp.hostname;
    },

    /**
     * delete protocol(scheme) from URL string.
     *
     * @param {string} url URL string
     * @return {string} string without protocol(scheme)
     */
    removeProtocol(url: string) {
        return url.replace(/^\w+:\/\//, "");
    },
};

const $ = {
    anchor(text?: string): HTMLAnchorElement {
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.

        if (text !== undefined) {
            anchor.textContent = text;
        }

        return anchor;
    },

    br(): HTMLBRElement {
        return document.createElement("br");
    },

    button(value: string, clazz?: string): HTMLInputElement {
        const button = document.createElement("input");
        button.type = "button";
        button.value = value;

        if (clazz) {
            button.classList.add(clazz);
        }

        return button;
    },

    div(clazz?: string): HTMLDivElement {
        const div = document.createElement("div");

        if (clazz !== undefined) {
            div.classList.add(clazz);
        }

        return div;
    },

    hide(element: HTMLElement): void {
        element.style.display = "none";
    },

    label(text: string, htmlFor: string): HTMLLabelElement {
        const label = document.createElement("label");
        label.htmlFor = htmlFor;
        label.textContent = text;
        return label;
    },

    message(messageName: string, substitutions?: string): string {
        return chrome.i18n.getMessage(messageName, substitutions);
    },

    onclick(element: HTMLElement, listener: EventListenerOrEventListenerObject): void {
        element.addEventListener("click", listener);
    },

    option(value: string, text: string): HTMLOptionElement {
        const option = document.createElement("option");
        option.setAttribute("value", value);
        option.textContent = text;
        return option;
    },

    radio(name: string, value: string, id: string): HTMLInputElement {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = value;
        radio.id = id;
        return radio;
    },

    removeSelf(element: Element): void {
        element.parentElement!.removeChild(element);
    },

    show(element: HTMLElement): void {
        element.style.display = "inline";
    },

    showBlock(element: HTMLElement): void {
        element.style.display = "block";
    },

    span(text: string, clazz?: string): HTMLSpanElement {
        const span = document.createElement("span");
        span.textContent = text;

        if (clazz !== undefined) {
            span.classList.add(clazz);
        }

        return span;
    },

    text(element: HTMLElement, text: string): void {
        element.textContent = text;
    },

    textField(size: number, value: string): HTMLInputElement {
        const textField = document.createElement("input");
        textField.type = "text";
        textField.size = size;
        textField.value = value;
        return textField;
    },
};

enum MenuPosition {
    COMPACT = "compact",
    DEFAULT = "default",
}

enum BlockType {
    SOFT = "soft",
    HARD = "hard",
}

enum BannedTarget {
    TITLE_AND_CONTENTS = "titleAndContents",
    TITLE_ONLY = "titleOnly",
}

class ApplicationError implements Error {
    public message: string;
    public name: string = "Application Error";

    constructor(message: string) {
        this.message = message;
    }

    public toString() {
        return this.name + ": " + this.message;
    }
}
