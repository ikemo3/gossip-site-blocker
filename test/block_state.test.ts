import BlockedSites from '../apps/model/blocked_sites';
import BlockedSite from '../apps/model/blocked_site';
import { $, BannedTarget, BlockType } from '../apps/common';
import { BannedWord } from '../apps/repository/banned_word_repository';
import BlockState from '../apps/content_script/block_state';
import { RegExpItem } from '../apps/repository/regexp_repository';
import { BlockReasonType } from '../apps/model/block_reason';
import { ContentToBlock } from '../apps/block/block';

describe('BlockState', () => {
    function createContents(url: string, contains: boolean): ContentToBlock {
        return {
            contains(_: string): boolean {
                return contains;
            },

            containsInTitle(_: string): boolean {
                return false;
            },

            getUrl(): string {
                return url;
            },
        };
    }

    function createEmptySites(): BlockedSites {
        return new BlockedSites([]);
    }

    function createSites(blockType: string, url: string): BlockedSites {
        const blockedSite = new BlockedSite(url, blockType);
        return new BlockedSites([blockedSite]);
    }

    function createBannedWord(
        keyword: string,
        blockType: BlockType,
        target: BannedTarget,
    ): BannedWord {
        return {
            blockType,
            keyword,
            target,
        };
    }

    function createRegexp(pattern: string, blockType: BlockType): RegExpItem {
        return {
            blockType,
            pattern,
        };
    }

    it('not blocked', () => {
        const target = createContents('http://example.com/foo/bar', false);
        const sites = createEmptySites();

        const blockState = new BlockState(target, sites, [], [], true);

        expect(blockState.getReason()).toBeUndefined();
        expect(blockState.getState()).toBe('none');
    });

    it('block by URL', () => {
        const target = createContents('http://example.com/foo/bar', false);
        const sites = createSites('soft', 'example.com');

        const blockState = new BlockState(target, sites, [], [], true);

        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.URL);
        expect(blockState.getReason()!.getReason()).toBe('example.com');
        expect(blockState.getState()).toBe('soft');
    });

    it('block by URL exactly', () => {
        const target = createContents('http://example.com', false);
        const sites = createSites('soft', 'example.com');

        const blockState = new BlockState(target, sites, [], [], true);

        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.URL_EXACTLY);
        expect(blockState.getReason()!.getReason()).toBe('example.com');
        expect(blockState.getState()).toBe('soft');
    });

    it('block by word', () => {
        const target = createContents('http://example.com', true);
        const bannedList = [
            createBannedWord('evil', BlockType.SOFT, BannedTarget.TITLE_AND_CONTENTS),
        ];

        const blockState = new BlockState(target, createEmptySites(), bannedList, [], true);

        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.WORD);
        expect(blockState.getReason()!.getReason()).toBe('evil');
        expect(blockState.getState()).toBe('soft');
    });

    it('block by regexp', () => {
        const target = createContents('http://example.com', true);
        const regexpList = [createRegexp('example\\..*', BlockType.SOFT)];

        const blockState = new BlockState(target, createEmptySites(), [], regexpList, true);

        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.REGEXP);
        expect(blockState.getReason()!.getReason()).toBe('example\\..*');
        expect(blockState.getState()).toBe('soft');
    });

    it('block by URL(exactly) vs word(hard block) => word(hard block)', () => {
        const target = createContents('http://example.com', true);
        const sites = createSites('soft', 'example.com');
        const bannedList = [
            createBannedWord('evil', BlockType.HARD, BannedTarget.TITLE_AND_CONTENTS),
        ];

        const blockState = new BlockState(target, sites, bannedList, [], true);

        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.WORD);
        expect(blockState.getReason()!.getReason()).toBe('evil');
        expect(blockState.getState()).toBe('hard');
    });

    it('block by IDN', () => {
        jest.spyOn($, 'message').mockReturnValue('Internationalized Domain Name');

        const target = createContents('http://xn--eckwd4c7cu47r2wf.jp', false);

        const blockState = new BlockState(target, createEmptySites(), [], [], true);

        expect(blockState.getReason()!.getType()).toBe(BlockReasonType.IDN);
        expect(blockState.getReason()!.getReason()).toBe('Internationalized Domain Name');
        expect(blockState.getState()).toBe('soft');
    });
});
