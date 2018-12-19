const ChromeStorage = {
    async load(keys) {
        // @ts-ignore
        return new Promise((resolve) => {
            chrome.storage.local.get(keys, resolve);
        });
    },
    async save(items) {
        return new Promise((resolve) => {
            chrome.storage.local.set(items, resolve);
        });
    },
    async get(keys) {
        return new Promise((resolve) => {
            chrome.storage.local.get(keys, resolve);
        });
    },
    async set(items) {
        return new Promise((resolve) => {
            chrome.storage.local.set(items, resolve);
        });
    },
};
// noinspection TsLint
const Logger = {
    debug(message, ...params) {
        OptionRepository.isDeveloperMode().then((developerMode) => {
            if (developerMode) {
                // noinspection TsLint
                console.log(message, ...params);
            }
        });
    },
    log(message, ...params) {
        // noinspection TsLint
        console.log(message, ...params);
    },
    error(message, ...params) {
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
    insertAfter(element, insertElement) {
        element.parentElement.insertBefore(insertElement, element.nextSibling);
    },
    /**
     * get hostname from URL string.
     *
     * example: https://example.com/path -> example.com
     * @param {string} url URL string
     * @return {string} hostname
     */
    getHostName(url) {
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
    removeProtocol(url) {
        return url.replace(/^\w+:\/\//, "");
    },
};
const $ = {
    anchor(text) {
        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // change link color.
        if (text !== undefined) {
            anchor.textContent = text;
        }
        return anchor;
    },
    br() {
        return document.createElement("br");
    },
    button(value, clazz) {
        const button = document.createElement("input");
        button.type = "button";
        button.value = value;
        if (clazz) {
            button.classList.add(clazz);
        }
        return button;
    },
    decodeURI(encodedURI) {
        try {
            return decodeURI(encodedURI);
        }
        catch (e) {
            return encodedURI;
        }
    },
    div(clazz) {
        const div = document.createElement("div");
        if (clazz !== undefined) {
            div.classList.add(clazz);
        }
        return div;
    },
    hide(element) {
        element.style.display = "none";
    },
    label(text, htmlFor) {
        const label = document.createElement("label");
        label.htmlFor = htmlFor;
        label.textContent = text;
        return label;
    },
    message(messageName, substitutions) {
        return chrome.i18n.getMessage(messageName, substitutions);
    },
    onclick(element, listener) {
        element.addEventListener("click", listener);
    },
    option(value, text) {
        const option = document.createElement("option");
        option.setAttribute("value", value);
        option.textContent = text;
        return option;
    },
    radio(name, value, id) {
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = name;
        radio.value = value;
        radio.id = id;
        return radio;
    },
    removeSelf(element) {
        element.parentElement.removeChild(element);
    },
    show(element) {
        element.style.display = "inline";
    },
    showBlock(element) {
        element.style.display = "block";
    },
    span(text, clazz) {
        const span = document.createElement("span");
        span.textContent = text;
        if (clazz !== undefined) {
            span.classList.add(clazz);
        }
        return span;
    },
    text(element, text) {
        element.textContent = text;
    },
    textField(size, value) {
        const textField = document.createElement("input");
        textField.type = "text";
        textField.size = size;
        textField.value = value;
        return textField;
    },
    toBlockType(value) {
        switch (value) {
            case "hard":
                return BlockType.HARD;
            case "soft":
            default:
                return BlockType.SOFT;
        }
    },
    toBannedTarget(value) {
        switch (value) {
            case "titleOnly":
                return BannedTarget.TITLE_ONLY;
            case "titleAndContents":
            default:
                return BannedTarget.TITLE_AND_CONTENTS;
        }
    },
};
var MenuPosition;
(function (MenuPosition) {
    MenuPosition["COMPACT"] = "compact";
    MenuPosition["DEFAULT"] = "default";
})(MenuPosition || (MenuPosition = {}));
var BlockType;
(function (BlockType) {
    BlockType["SOFT"] = "soft";
    BlockType["HARD"] = "hard";
})(BlockType || (BlockType = {}));
var BannedTarget;
(function (BannedTarget) {
    BannedTarget["TITLE_AND_CONTENTS"] = "titleAndContents";
    BannedTarget["TITLE_ONLY"] = "titleOnly";
})(BannedTarget || (BannedTarget = {}));
class ApplicationError {
    constructor(message) {
        this.name = "Application Error";
        this.message = message;
    }
    toString() {
        return this.name + ": " + this.message;
    }
}
//# sourceMappingURL=common.js.map