function create_appbar_links() {
    const resultStats = document.getElementById("resultStats");
    if (resultStats !== null) {
        const resultStatsIsHidden = getComputedStyle(resultStats).opacity === "0";
        if (!resultStatsIsHidden) {
            const anchor = $.anchor($.message("temporarilyUnblockAll"));
            $.onclick(anchor, temporarily_unblock_all);

            resultStats.appendChild(anchor);

            if (options!.bannedWordOption.showInfo) {
                const showInfo = $.anchor($.message("showBlockedByWordInfo"));
                showInfo.style.marginLeft = "1rem";
                $.onclick(showInfo, show_blocked_by_banned_words);
                resultStats.appendChild(showInfo);
            }

            return;
        }
    }

    const menu = document.getElementById("hdtbMenus");
    if (menu !== null && menu.style.display !== "none") {
        const toolDiv = document.querySelector(".hdtb-mn-cont");
        if (toolDiv !== null) {
            const anchor = $.anchor($.message("temporarilyUnblockAll"));
            $.onclick(anchor, temporarily_unblock_all);

            toolDiv.appendChild(anchor);

            if (options!.bannedWordOption.showInfo) {
                const showInfo = $.anchor($.message("showBlockedByWordInfo"));
                showInfo.style.marginLeft = "1rem";
                $.onclick(showInfo, show_blocked_by_banned_words);
                toolDiv.appendChild(showInfo);
            }

            return;
        }
    }
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

function show_blocked_by_banned_words() {
    const lines = blockReasons.map((reason) => {
        if (reason.getType() === BlockReasonType.WORD) {
            return reason.getUrl();
        } else {
            return undefined;
        }
    }).filter((v) => v); // remove undefined.

    console.log(lines.join("\n"));
}
