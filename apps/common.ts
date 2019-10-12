const ChromeStorage = {
    async load<T>(keys: T): Promise<T> {
        return new Promise((resolve) => {
            // @ts-ignore
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

interface ITextAreaParams {
    id?: string;
    cols?: number;
    rows?: number;
}

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

    decodeURI(encodedURI: string) {
        try {
            return decodeURI(encodedURI);
        } catch (e) {
            return encodedURI;
        }
    },

    div(clazz?: string): HTMLDivElement {
        const div = document.createElement("div");

        if (clazz !== undefined) {
            div.classList.add(clazz);
        }

        return div;
    },

    escape(str: string): string {
        return str.replace(/\\/g, "\\\\").replace(/\+/g, "\\+").replace(/ /g, "+");
    },

    hide(element: HTMLElement): void {
        element.style.display = "none";
    },

    insertBefore(element: HTMLElement, afterElement: HTMLElement) {
        afterElement.parentElement!.insertBefore(element, afterElement);
    },

    async isGoogleSearch(url: string): Promise<boolean> {
        const manifestUrl = chrome.runtime.getURL("manifest.json");

        const response = await fetch(manifestUrl);
        const manifest = await response.json();
        const matches = manifest.content_scripts[0].matches;

        for (const match of matches) {
            // remove last '*' of pattern.
            const pattern = match.replace("*", "");

            if (url.startsWith(pattern)) {
                return true;
            }
        }

        return false;
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

    regexp(pattern: string): RegExp | null {
        try {
            return new RegExp(pattern);
        } catch (e) {
            return null;
        }
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

    textarea(value: string, params: ITextAreaParams): HTMLTextAreaElement {
        const textarea = document.createElement("textarea");
        textarea.textContent = value;

        if (params.cols) {
            textarea.cols = params.cols;
        }

        if (params.id) {
            textarea.id = params.id;
        }

        if (params.rows) {
            textarea.rows = params.rows;
        }

        return textarea;
    },

    textField(value: string, size?: number): HTMLInputElement {
        const textField = document.createElement("input");
        textField.type = "text";
        textField.value = value;

        if (size !== undefined) {
            textField.size = size;
        }

        return textField;
    },

    toBlockType(value: string): BlockType {
        switch (value) {
            case "hard":
                return BlockType.HARD;
            case "soft":
            default:
                return BlockType.SOFT;
        }
    },

    toBannedTarget(value: string): BannedTarget {
        switch (value) {
            case "titleOnly":
                return BannedTarget.TITLE_ONLY;
            case "titleAndContents":
            default:
                return BannedTarget.TITLE_AND_CONTENTS;
        }
    },

    unescape(str: string): string {
        return str.replace(/(\\\\|\\\+|\+)/g, (matched) => {
            if (matched === "\\\\") {
                return "\\";
            } else if (matched === "\\+") {
                return "+";
            } else if (matched === "+") {
                return " ";
            } else {
                return matched;
            }
        });
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
