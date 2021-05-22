export interface IBasicBlockMediator {
    blockPage(isUrl: boolean, pattern: string, blockType: string): Promise<void>;
}

export interface IBlockMediator {
    hide(): void;
    showBlockDialog(): void;
    showChangeStateDialog(): void;
}
