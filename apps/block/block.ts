export interface ContentToBlock {
    getUrl(): string;

    contains(keyword: string): boolean;

    containsInTitle(keyword: string): boolean;
}

export interface SearchResultToBlock {
    getUrl(): string;

    canRetry(): boolean;

    canBlock(): boolean;

    contains(keyword: string): boolean;

    containsInTitle(keyword: string): boolean;

    deleteElement(): void;

    getElement(): Element;

    getCompactMenuInsertElement(): Element;

    getPosition(): string;

    getCssClass(): string;
}
