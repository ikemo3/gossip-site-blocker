import { BlockedSites } from '../../option/blocked_sites';
import { BannedWordRepository, IBannedWord } from '../../banned_word_repository';
import { IRegExpItem, RegExpRepository } from '../../regexp_repository';
import { IAutoBlockIDNOption, IBannedWordOption, OptionRepository } from '../../option/config';
import { Logger, MenuPosition } from '../../common';
import { BlockReason } from '../block_reason';
import { BlockedSitesRepository } from '../../option/block';
import {
    blockGoogleElement,
    blockGoogleInnerCard,
    blockGoogleTopNews,
} from '../block_target_factory';

export interface IOptions {
    blockedSites: BlockedSites;
    bannedWords: IBannedWord[];
    regexpList: IRegExpItem[];
    idnOption: IAutoBlockIDNOption;
    defaultBlockType: string;
    menuPosition: MenuPosition;
    bannedWordOption: IBannedWordOption;
}

export const blockReasons: BlockReason[] = [];

(async (): Promise<void> => {
    const blockedSites: BlockedSites = await BlockedSitesRepository.load();
    const bannedWords: IBannedWord[] = await BannedWordRepository.load();
    const regexpList: IRegExpItem[] = await RegExpRepository.load();
    const idnOption = await OptionRepository.getAutoBlockIDNOption();
    const defaultBlockType: string = await OptionRepository.defaultBlockType();
    const menuPosition: MenuPosition = await OptionRepository.menuPosition();
    const bannedWordOption: IBannedWordOption = await OptionRepository.getBannedWordOption();
    Logger.debug('autoBlockIDNOption:', idnOption);

    const gsbOptions = {
        blockedSites,
        bannedWords,
        regexpList,
        idnOption,
        defaultBlockType,
        menuPosition,
        bannedWordOption,
    };

    // add observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            for (const node of mutation.addedNodes) {
                if (node instanceof Element) {
                    if (node.classList.contains('g')) {
                        tryBlockGoogleElement(node, gsbOptions);
                    } else if (node.nodeName.toLowerCase() === 'g-inner-card') {
                        tryBlockGoogleInnerCard(node, gsbOptions);
                    } else if (node.classList.contains('dbsr')) {
                        tryBlockGoogleTopNews(node, gsbOptions);
                    }
                }
            }
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.documentElement, config);
})();

const subObserverList: MutationObserver[] = [];

type IBlockFunction = (g1: Element, options: IOptions) => boolean;

function blockClosure(node: Element, options: IOptions, blockFunc: IBlockFunction): () => void {
    let completed = false;
    return (): void => {
        if (completed) {
            return;
        }

        completed = blockFunc(node, options);
    };
}

function tryBlockElement(node: Element, options: IOptions, blockFunction: IBlockFunction): void {
    // first, try block.
    const completed = blockFunction(node, options);
    if (completed) {
        return;
    }

    // if failed, add observer for retry.
    const block = blockClosure(node, options, blockFunction);
    const subObserver = new MutationObserver(() => {
        block();
    });

    subObserver.observe(node, { childList: true, subtree: true });
    subObserverList.push(subObserver);
}

function tryBlockGoogleElement(node: Element, options: IOptions): void {
    tryBlockElement(node, options, blockGoogleElement);
}

function tryBlockGoogleInnerCard(node: Element, options: IOptions): void {
    tryBlockElement(node, options, blockGoogleInnerCard);
}

function tryBlockGoogleTopNews(node: Element, options: IOptions): void {
    tryBlockElement(node, options, blockGoogleTopNews);
}

document.addEventListener('DOMContentLoaded', () => {
    // clear sub-observer
    for (const subObserver of subObserverList) {
        subObserver.disconnect();
    }
});
