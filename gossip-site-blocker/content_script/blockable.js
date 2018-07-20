const BlockTargetFactory = {
    init: async function () {
        let count = 0;

        // ブロックされたサイト
        const blockedSites = await BlockedSitesRepository.load();

        document.querySelectorAll(".g").forEach(async function (g1) {
            const g = new GoogleElement(g1);

            // ブロックできない要素の場合は無視
            if (!g.canBlock()) {
                return;
            }

            // ブロックされているかどうかを取得
            /**
             * @type {BlockedSite|undefined}
             */
            const blockedSite = blockedSites.matches(g.getUrl());

            /**
             * ブロック状態
             * @type {"none"|"soft"|"hard"}
             */
            const state = (blockedSite ? blockedSite.getState() : "none");

            /**
             * ブロックする、あるいはブロック解除するURL
             * @type {string}
             */
            const targetUrl = (blockedSite ? blockedSite.url : g.getUrl());

            // ハードブロックの場合は抹消
            if (state === "hard") {
                g.deleteElement();
                return;
            }

            const id = `block${++count}`;
            const blockTarget = new BlockTarget(g.getElement(), g.getUrl(), id, state);
            const blockAnchor = new BlockAnchor(id, state, blockTarget, targetUrl);

            // ターゲットの直後に追加する
            DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
        });

        document.querySelectorAll("g-inner-card").forEach(async function (g1) {
            const g = new GoogleInnerCard(g1);

            // ブロックできない要素の場合は無視
            if (!g.canBlock()) {
                return;
            }

            // ブロックされているかどうかを取得
            /**
             * @type {BlockedSite|undefined}
             */
            const blockedSite = blockedSites.matches(g.getUrl());

            /**
             * ブロック状態
             * @type {"none"|"soft"|"hard"}
             */
            const state = (blockedSite ? blockedSite.getState() : "none");

            /**
             * ブロックする、あるいはブロック解除するURL
             * @type {string}
             */
            const targetUrl = (blockedSite ? blockedSite.url : g.getUrl());

            // ハードブロックの場合は抹消
            if (state === "hard") {
                g.deleteElement();
                return;
            }

            const id = `block${++count}`;
            const blockTarget = new BlockTarget(g.getElement(), g.getUrl(), id, state);
            const blockAnchor = new BlockAnchor(id, state, blockTarget, targetUrl);
            blockAnchor.setWrappable("205px");

            // ターゲットの直後に追加する
            DOMUtils.insertAfter(blockTarget.getDOMElement(), blockAnchor.getDOMElement());
        });

        return this;
    }
};

class GoogleInnerCard {
    constructor(element) {
        const anchorList = element.getElementsByTagName("a");

        const urlList = [];
        for (const anchor of anchorList) {
            const href = anchor.getAttribute("href");

            // hrefがない場合は無視
            if (href === null) {
                continue;
            }

            urlList.push(href);
        }

        // アンカーがない場合は何もしない
        if (urlList.length === 0) {
            this.valid = false;
            return;
        }

        this.valid = true;
        this.url = urlList[0];
        this.element = element;
    }

    canBlock() {
        return this.valid;
    }

    getUrl() {
        return this.url;
    }

    getElement() {
        return this.element;
    }

    /**
     * 要素を抹消する
     */
    deleteElement() {
        this.element.parentElement.removeChild(this.element);
    }
}

class GoogleElement {
    constructor(element) {
        const classList = element.classList;

        // 親要素に'.g'がある場合はブロック対象外
        let parent = element.parentElement;
        while (true) {
            // ルートまでたどり着いたときは抜ける
            if (parent === null) {
                break;
            }

            // class=gがあったら対象外
            if (parent.classList.contains("g")) {
                this.value = false;
                return;
            }

            parent = parent.parentElement;
        }

        // 右側のペインに表示される情報はブロック対象外
        if (classList.contains("rhsvw")) {
            this.valid = false;
            return;
        }

        const anchorList = element.getElementsByTagName("a");

        const urlList = [];
        for (const anchor of anchorList) {
            const href = anchor.getAttribute("href");

            // hrefがない場合は無視
            if (href === null) {
                continue;
            }

            // メニューなどは無視
            if (href === "#") {
                continue;
            }

            // キャッシュは無視
            if (href.startsWith("https://webcache.googleusercontent.com")) {
                continue;
            }

            if (href.startsWith("http://webcache.googleusercontent.com")) {
                continue;
            }

            // 類似ページへのリンクは無視
            if (href.startsWith("/search?")) {
                continue;
            }

            urlList.push(href);
        }

        // アンカーがない場合は何もしない
        if (urlList.length === 0) {
            this.valid = false;
            return;
        }

        this.valid = true;
        this.url = urlList[0];
        this.element = element;
    }

    canBlock() {
        return this.valid;
    }

    getUrl() {
        return this.url;
    }

    getElement() {
        return this.element;
    }

    /**
     * 要素を抹消する
     */
    deleteElement() {
        this.element.parentElement.removeChild(this.element);
    }
}

/**
 * ブロック対象となる要素
 *
 * @property element {Element}
 * @property id {string}
 */
class BlockTarget {
    /**
     *
     * @param element {Element} ブロック対象の要素
     * @param url {string}
     * @param id {string}
     * @param state {"none"|"soft"|"hard"}
     */
    constructor(element, url, id, state) {
        this.element = element;
        this.setUrl(url);

        // IDのセット
        this.id = id;
        this.element.setAttribute("id", id);

        this.setState(state);
    }

    getDOMElement() {
        return this.element;
    }

    /**
     * @private
     * @param url {string}
     */
    setUrl(url) {
        this.element.setAttribute("data-blocker-url", url);
    }

    /**
     * @returns {string}
     */
    getUrl() {
        return this.element.getAttribute("data-blocker-url");
    }

    /**
     *
     * @param state {"none"|"soft"|"hard"}
     */
    setState(state) {
        this.element.setAttribute("data-blocker-state", state);

        switch (state) {
            case "hard":
                // hardのときはここまで到達しないはず
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

    show() {
        this.element.removeAttribute("data-blocker-display");
    }

    hide() {
        this.element.setAttribute("data-blocker-display", "none");
    }

    unhide() {
        this.element.setAttribute("data-blocker-display", "unhide");
    }
}

/**
 * ブロックをコントロールするためのアンカー
 *
 * @property element アンカーを包むdiv要素
 * @property anchor アンカー
 * @property state ブロック状態
 * @property url ブロックするURL
 */
class BlockAnchor {
    /**
     *
     * @param {string} targetId ブロック対象の要素のid
     * @param {"none"|"soft"|"hard"} state ブロック対象かどうかの状態
     * @param {BlockTarget} targetObject ブロック対象
     * @param {string} url ブロックするURL
     */
    constructor(targetId, state, targetObject, url) {
        const div = document.createElement("div");
        div.classList.add("block-anchor");

        const anchor = document.createElement("a");
        anchor.setAttribute("href", "javascript:void(0)"); // リンクの色を変えるための処置
        anchor.setAttribute("data-blocker-target-id", targetId);
        div.appendChild(anchor);

        this.element = div;
        this.anchor = anchor;
        this.url = url;
        this.state = state;
        this.targetObject = targetObject;
        this.handler = null;

        this.setText();
        this.setHandler();
    }

    getDOMElement() {
        return this.element;
    }

    setWrappable(width) {
        this.element.style.width = width;
        this.element.style.whiteSpace = "normal";
    }

    setState(newState) {
        this.state = newState;
        this.anchor.setAttribute("data-blocker-state", newState);

        this.setHandler();
        this.setText();
    }

    setHandler() {
        if (this.handler) {
            this.anchor.removeEventListener("click", this.handler);
            this.handler = null;
        }

        switch (this.state) {
            case "none":
                // ブロックハンドラの設定
//                this.handler = this.blockPage.bind(this);
                this.handler = this.showBlockDialog.bind(this);
                break;

            case "soft":
                // ブロック解除ハンドラの設定
                this.handler = this.unhide.bind(this);
                break;

            case "hard":
                // 何もしない
                break;

            case "unhide":
                // 非表示ハンドラの設定
                this.handler = this.hide.bind(this);
                break;
        }

        if (this.handler) {
            this.anchor.addEventListener("click", this.handler);
        }
    }

    setText() {
        switch (this.state) {
            case "none":
                this.anchor.textContent = chrome.i18n.getMessage("blockThisPage");
                break;
            case "soft":
                this.anchor.textContent = chrome.i18n.getMessage("temporarilyUnblock", [decodeURI(this.url)]);
                break;
            case "hard":
                this.anchor.textContent = "";
                break;
            case "unhide":
                this.anchor.textContent = chrome.i18n.getMessage("unhideThisPage");
                break;
        }
    }

    showBlockDialog(ignore) {
        // ダイアログの表示
        new BlockDialog(this, this.url);
    }

    /**
     * ブロック
     * @param {string} url
     */
    blockPage(url) {
        // 非表示
        this.targetObject.hide();
        this.setState("soft");

        // URLを登録
        BlockedSitesRepository.add(url);
    }

    /**
     * 一時ブロック解除
     * @param ignore
     */
    unhide(ignore) {
        // 一時ブロック解除
        this.targetObject.unhide();
        this.setState("unhide");
    }

    /**
     * 非表示
     * @param ignore
     */
    hide(ignore) {
        // 非表示
        this.targetObject.hide();
        this.setState("soft");
    }
}
