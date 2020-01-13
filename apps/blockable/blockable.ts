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
