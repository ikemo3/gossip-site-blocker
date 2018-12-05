class HideAnchor {
    constructor(mediator, div) {
        this.mediator = mediator;
        const anchor = $.anchor($.message("hideThisPage"));
        $.onclick(anchor, this.mediator.hide.bind(this.mediator));
        div.appendChild(anchor);
        this.anchor = anchor;
    }
    none() {
        $.hide(this.anchor);
    }
    unhide() {
        $.show(this.anchor);
    }
    hide() {
        $.hide(this.anchor);
    }
    block() {
        $.hide(this.anchor);
    }
}
//# sourceMappingURL=hide_anchor.js.map