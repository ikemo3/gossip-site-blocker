import {
    $, BannedTarget, BlockType, DOMUtils,
} from '../common';
import { RegExpItem } from '../repository/regexp_repository';
import BlockedSites from '../model/blocked_sites';
import { BannedWord } from '../repository/banned_word_repository';
import { AutoBlockIDNOption } from '../repository/config';
import BlockedSite from '../model/blocked_site';
import { BlockReason, BlockReasonType } from '../model/block_reason';
import { BlockableContents } from '../blockable/blockable';

class BlockState {
    private readonly state: string;

    private readonly blockReason?: BlockReason;

    constructor(blockable: BlockableContents,
        blockedSites: BlockedSites,
        bannedWords: BannedWord[],
        regexpList: RegExpItem[],
        idnOption: AutoBlockIDNOption) {
        const blockedSite: BlockedSite | undefined = blockedSites.matches(blockable.getUrl());

        const banned: BannedWord | undefined = bannedWords.find((bannedWord) => {
            const { keyword } = bannedWord;

            switch (bannedWord.target) {
            case BannedTarget.TITLE_ONLY:
                return blockable.containsInTitle(keyword);

            case BannedTarget.TITLE_AND_CONTENTS:
            default:
                return blockable.contains(keyword);
            }
        });

        const regexp: RegExpItem | undefined = regexpList.find((regexpItem) => {
            const pattern = new RegExp(regexpItem.pattern);

            return pattern.test(DOMUtils.removeProtocol(blockable.getUrl()));
        });

        // FIXME: priority
        if (blockedSite
            && (!banned || banned.blockType !== BlockType.HARD)
            && (!regexp || regexp.blockType !== BlockType.HARD)) {
            this.state = blockedSite.getState();

            if (DOMUtils.removeProtocol(blockable.getUrl()) === blockedSite.url) {
                this.blockReason = new BlockReason(BlockReasonType.URL_EXACTLY, blockable.getUrl(),
                    blockedSite.url);
            } else {
                this.blockReason = new BlockReason(BlockReasonType.URL, blockable.getUrl(),
                    blockedSite.url);
            }

            return;
        }
        if (banned) {
            this.state = banned.blockType.toString();
            this.blockReason = new BlockReason(BlockReasonType.WORD, blockable.getUrl(),
                banned.keyword);
            return;
        }
        if (regexp) {
            this.state = regexp.blockType.toString();
            this.blockReason = new BlockReason(BlockReasonType.REGEXP, blockable.getUrl(),
                regexp.pattern);
            return;
        }

        // check IDN
        const { enabled } = idnOption;

        if (enabled) {
            const url = blockable.getUrl();
            const hostname = DOMUtils.getHostName(url);

            if (hostname.startsWith('xn--') || hostname.includes('.xn--')) {
                this.state = 'soft';
                this.blockReason = new BlockReason(BlockReasonType.IDN, url, $.message('IDN'));
                return;
            }
        }

        this.state = 'none';
    }

    public getReason(): BlockReason | undefined {
        return this.blockReason;
    }

    public getState(): string {
        return this.state;
    }
}

export default BlockState;
