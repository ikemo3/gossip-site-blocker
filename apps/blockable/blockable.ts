export interface Blockable {
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

export interface IBlockTarget {
    getUrl(): string;

    contains(keyword: string): boolean;

    containsInTitle(keyword: string): boolean;
}
