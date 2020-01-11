import { GoogleTopNews } from './google_top_news';
import { BlockState } from './block_state';
import { BlockMediator } from './block_mediator';
import { GoogleElement } from './google_element';
import { GoogleInnerCard } from './google_inner_card';
import { blockReasons, IOptions } from './document_start/start';

export interface IBlockTarget {
    getUrl(): string;

    contains(keyword: string): boolean;

    containsInTitle(keyword: string): boolean;
}

export interface IBlockable {
    getUrl(): string;

    canBlock(): boolean;

    contains(keyword: string): boolean;

    containsInTitle(keyword: string): boolean;

    deleteElement(): void;

    getElement(): Element;

    getOperationInsertPoint(): Element;

    getPosition(): string;

    getCssClass(): string;
}

export function blockGoogleElement(g1: Element, options: IOptions): boolean {
    const g = new GoogleElement(g1);

    if (g.isIgnoreable()) {
        return true;
    }

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords,
        options.regexpList, options.idnOption);

    if (blockState.getReason()) {
        blockReasons.push(blockState.getReason()!);
    }

    if (blockState.getState() === 'hard') {
        g.deleteElement();
        return true;
    }

    const _ = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}

export function blockGoogleInnerCard(g1: Element, options: IOptions): boolean {
    const g = new GoogleInnerCard(g1);

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords,
        options.regexpList, options.idnOption);

    if (blockState.getReason()) {
        blockReasons.push(blockState.getReason()!);
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

export function blockGoogleTopNews(g1: Element, options: IOptions): boolean {
    const g = new GoogleTopNews(g1);

    if (!g.canBlock()) {
        return false;
    }

    const blockState: BlockState = new BlockState(g, options.blockedSites, options.bannedWords,
        options.regexpList, options.idnOption);

    if (blockState.getReason()) {
        blockReasons.push(blockState.getReason()!);
    }

    if (blockState.getState() === 'hard') {
        g.deleteElement();
        return true;
    }

    const _ = new BlockMediator(g, blockState, options.defaultBlockType, options.menuPosition);
    return true;
}
