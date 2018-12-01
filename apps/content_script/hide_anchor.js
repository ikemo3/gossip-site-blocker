class HideAnchor {
    constructor(mediator, div) {
        this.mediator = mediator;
        const anchor = $.anchor($.message("hideThisPage"));
        $.onclick(anchor, this.mediator.hide.bind(this.mediator));
        const br = $.br();
        div.appendChild(anchor);
        div.appendChild(br);
        this.anchor = anchor;
        this.br = br;
    }
    none() {
        $.hide(this.anchor);
        $.hide(this.br);
    }
    unhide() {
        $.show(this.anchor);
        $.show(this.br);
    }
    hide() {
        $.hide(this.anchor);
        $.hide(this.br);
    }
    block() {
        $.hide(this.anchor);
        $.hide(this.br);
    }
}
//# sourceMappingURL=hide_anchor.js.map