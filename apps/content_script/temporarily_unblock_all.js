function create_temporarily_unblock_all() {
    const resultStats = document.getElementById("resultStats");
    if (resultStats === null) {
        return;
    }
    const anchor = $.anchor($.message("temporarilyUnblockAll"));
    $.onclick(anchor, temporarily_unblock_all);
    resultStats.appendChild(anchor);
}
function temporarily_unblock_all() {
    const anchorList = document.querySelectorAll(".blocker-temporarily-unblock");
    for (const anchor of anchorList) {
        if (anchor instanceof HTMLAnchorElement) {
            if (anchor.style.display !== "none") {
                anchor.click();
            }
        }
    }
}
//# sourceMappingURL=temporarily_unblock_all.js.map