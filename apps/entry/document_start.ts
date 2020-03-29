import BlockedSites from '../model/blocked_sites';
import { BannedWordRepository, BannedWord } from '../repository/banned_word_repository';
import { RegExpItem, RegExpRepository } from '../repository/regexp_repository';
import { AutoBlockIDNOption, BannedWordOption, OptionRepository } from '../repository/config';
import { Logger, MenuPosition } from '../common';
import { BlockReason } from '../model/block_reason';
import BlockedSitesRepository from '../repository/blocked_sites';
import GoogleElement from '../blockable/google_element';
import BlockState from '../content_script/block_state';
import BlockMediator from '../content_script/block_mediator';
import GoogleInnerCard from '../blockable/google_inner_card';
import GoogleTopNews from '../blockable/google_top_news';

export interface Options {
    blockedSites: BlockedSites;
    bannedWords: BannedWord[];
    regexpList: RegExpItem[];
    idnOption: AutoBlockIDNOption;
    defaultBlockType: string;
    menuPosition: MenuPosition;
    bannedWordOption: BannedWordOption;
}

declare global {
    interface Window {
        blockReasons: BlockReason[];
    }
}

window.blockReasons = [];

// This is necessary when using the back button.
let gsbOptions: Options | null = null;
const pendingsGoogle: Element[] = [];
const pendingsInnerCard: Element[] = [];
const pendingsTopNews: Element[] = [];
const subObserverList: MutationObserver[] = [];

type IBlockFunction = (g1: Element, options: Options) => boolean;

function blockClosure(node: Element, options: Options, blockFunc: IBlockFunction): () => void {
    let completed = false;
    return (): void => {
        if (completed) {
            return;
        }

        completed = blockFunc(node, options);
    };
}

function tryBlockElement(node: Element, options: Options, blockFunction: IBlockFunction): void {
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

function blockGoogleElement(g1: Element, options: Options): boolean {
    const g = new GoogleElement(g1);

    if (g.isIgnorable()) {
        return true;
    }

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords,
        options.regexpList, options.idnOption);

    if (blockState.getReason()) {
        window.blockReasons.push(blockState.getReason()!);
    }

    if (blockState.getState() === 'hard') {
        g.deleteElement();
        return true;
    }

    const _ = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}

function blockGoogleInnerCard(g1: Element, options: Options): boolean {
    const g = new GoogleInnerCard(g1);

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords,
        options.regexpList, options.idnOption);

    if (blockState.getReason()) {
        window.blockReasons.push(blockState.getReason()!);
    }

    if (blockState.getState() === 'hard') {
        g.deleteElement();
        return true;
    }

    const mediator = new BlockMediator(g, blockState, options.defaultBlockType,
        options.menuPosition);
    mediator.setWrappable('205px');
    return true;
}

function blockGoogleTopNews(g1: Element, options: Options): boolean {
    const g = new GoogleTopNews(g1);

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords,
        options.regexpList, options.idnOption);

    if (blockState.getReason()) {
        window.blockReasons.push(blockState.getReason()!);
    }

    if (blockState.getState() === 'hard') {
        g.deleteElement();
        return true;
    }

    const _ = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}

function tryBlockGoogleElement(node: Element, options: Options): void {
    tryBlockElement(node, options, blockGoogleElement);
}

function tryBlockGoogleInnerCard(node: Element, options: Options): void {
    tryBlockElement(node, options, blockGoogleInnerCard);
}

function tryBlockGoogleTopNews(node: Element, options: Options): void {
    tryBlockElement(node, options, blockGoogleTopNews);
}

// add observer
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
                if (node.classList.contains('g')) {
                    if (gsbOptions !== null) {
                        tryBlockGoogleElement(node, gsbOptions);
                    } else {
                        pendingsGoogle.push(node);
                    }
                } else if (node.nodeName.toLowerCase() === 'g-inner-card') {
                    if (gsbOptions !== null) {
                        tryBlockGoogleInnerCard(node, gsbOptions);
                    } else {
                        pendingsInnerCard.push(node);
                    }
                } else if (node.classList.contains('dbsr')) {
                    if (gsbOptions !== null) {
                        tryBlockGoogleTopNews(node, gsbOptions);
                    } else {
                        pendingsTopNews.push(node);
                    }
                }
            }
        }
    });
});

const config = { childList: true, subtree: true };
observer.observe(document.documentElement, config);

(async (): Promise<void> => {
    const blockedSites: BlockedSites = await BlockedSitesRepository.load();
    const bannedWords: BannedWord[] = await BannedWordRepository.load();
    const regexpList: RegExpItem[] = await RegExpRepository.load();
    const idnOption = await OptionRepository.getAutoBlockIDNOption();
    const defaultBlockType: string = await OptionRepository.defaultBlockType();
    const menuPosition: MenuPosition = await OptionRepository.menuPosition();
    const bannedWordOption: BannedWordOption = await OptionRepository.getBannedWordOption();
    Logger.debug('autoBlockIDNOption:', idnOption);

    gsbOptions = {
        blockedSites,
        bannedWords,
        regexpList,
        idnOption,
        defaultBlockType,
        menuPosition,
        bannedWordOption,
    };

    for (const node of pendingsGoogle) {
        tryBlockGoogleElement(node, gsbOptions);
    }

    for (const node of pendingsInnerCard) {
        tryBlockGoogleInnerCard(node, gsbOptions);
    }

    for (const node of pendingsTopNews) {
        tryBlockGoogleTopNews(node, gsbOptions);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // clear sub-observer
    for (const subObserver of subObserverList) {
        subObserver.disconnect();
    }
});
