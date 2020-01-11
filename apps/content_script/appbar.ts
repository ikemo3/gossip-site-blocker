import { $ } from '../common';
import { BlockReasonType } from './block_state';
import { blockReasons } from './document_start/start';
import { OptionRepository } from '../option/config';

export async function create_appbar_links(): Promise<void> {
    const resultStats = document.getElementById('resultStats');
    if (resultStats !== null) {
        const resultStatsIsHidden = getComputedStyle(resultStats).opacity === '0';
        if (!resultStatsIsHidden) {
            const anchor = $.anchor($.message('temporarilyUnblockAll'));
            $.onclick(anchor, temporarily_unblock_all);

            resultStats.appendChild(anchor);

            const bannedWordOption = await OptionRepository.getBannedWordOption();
            if (bannedWordOption.showInfo) {
                const showInfo = $.anchor($.message('showBlockedByWordInfo'));
                showInfo.style.marginLeft = '1rem';
                $.onclick(showInfo, show_blocked_by_banned_words);
                resultStats.appendChild(showInfo);
            }

            return;
        }
    }

    const menu = document.getElementById('hdtbMenus');
    if (menu !== null && menu.style.display !== 'none') {
        const toolDiv = document.querySelector('.hdtb-mn-cont');
        if (toolDiv !== null) {
            const anchor = $.anchor($.message('temporarilyUnblockAll'));
            $.onclick(anchor, temporarily_unblock_all);

            toolDiv.appendChild(anchor);

            const bannedWordOption = await OptionRepository.getBannedWordOption();
            if (bannedWordOption.showInfo) {
                const showInfo = $.anchor($.message('showBlockedByWordInfo'));
                showInfo.style.marginLeft = '1rem';
                $.onclick(showInfo, show_blocked_by_banned_words);
                toolDiv.appendChild(showInfo);
            }
        }
    }
}

function temporarily_unblock_all(): void {
    const anchorList = document.querySelectorAll('.blocker-temporarily-unblock');

    for (const anchor of anchorList) {
        if (anchor instanceof HTMLAnchorElement) {
            if (anchor.style.display !== 'none') {
                anchor.click();
            }
        }
    }
}

function show_blocked_by_banned_words(): void {
    const id = 'urls_by_banned_words';

    const currentTextArea = document.getElementById(id);
    if (currentTextArea) {
        $.removeSelf(currentTextArea);
        return;
    }

    const lines = blockReasons.map((reason) => {
        if (reason.getType() === BlockReasonType.WORD) {
            return reason.getUrl();
        }
        return undefined;
    }).filter((v) => v); // remove undefined.

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
