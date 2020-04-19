import { $ } from '../common';
import { BlockReasonType } from '../model/block_reason';
import { OptionRepository } from '../repository/config';

function temporarilyUnblockAll(): void {
    const anchorList = document.querySelectorAll('.blocker-temporarily-unblock');

    for (const anchor of anchorList) {
        if (anchor instanceof HTMLAnchorElement) {
            if (anchor.style.display !== 'none') {
                anchor.click();
            }
        }
    }
}

function showBlockedByBannedWords(): void {
    const id = 'urls_by_banned_words';

    const currentTextArea = document.getElementById(id);
    if (currentTextArea) {
        $.removeSelf(currentTextArea);
        return;
    }

    const lines = window.blockReasons
        .map((reason) => {
            if (reason.getType() === BlockReasonType.WORD) {
                return reason.getUrl();
            }
            return undefined;
        })
        .filter((v) => v); // remove undefined.

    // create textarea after 'topstuff'
    const textarea = $.textarea(lines.join('\n'), {
        cols: 70,
        id,
        rows: 10,
    });

    const topStuff = document.getElementById('topstuff') as HTMLDivElement;
    topStuff.appendChild(textarea);
    $.insertBefore(textarea, topStuff);
}

async function appendTemporarilyUnblockAllAnchor(element: Element): Promise<void> {
    const display = await OptionRepository.DisplayTemporarilyUnblockAll.load();
    if (display) {
        const anchor = $.anchor($.message('temporarilyUnblockAll'));
        $.onclick(anchor, temporarilyUnblockAll);

        element.appendChild(anchor);
    }
}

async function appendShowBlockedByWordInfoAnchor(element: Element): Promise<void> {
    const bannedWordOption = await OptionRepository.ShowBlockedByWordInfo.load();
    if (bannedWordOption) {
        const showInfo = $.anchor($.message('showBlockedByWordInfo'));
        showInfo.style.marginLeft = '1rem';
        $.onclick(showInfo, showBlockedByBannedWords);
        element.appendChild(showInfo);
    }
}

async function createAppbarLinks(): Promise<void> {
    const resultStats = document.getElementById('result-stats');
    if (resultStats !== null) {
        const resultStatsIsHidden = getComputedStyle(resultStats).opacity === '0';
        if (!resultStatsIsHidden) {
            await appendTemporarilyUnblockAllAnchor(resultStats);
            await appendShowBlockedByWordInfoAnchor(resultStats);

            return;
        }
    }

    const menu = document.getElementById('hdtbMenus');
    if (menu !== null && menu.style.display !== 'none') {
        const toolDiv = document.querySelector('.hdtb-mn-cont');
        if (toolDiv !== null) {
            await appendTemporarilyUnblockAllAnchor(toolDiv);
            await appendShowBlockedByWordInfoAnchor(toolDiv);
        }
    }
}

export default createAppbarLinks;
