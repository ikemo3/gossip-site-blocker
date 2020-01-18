// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBasicBlockMediator {
    blockPage(isUrl: boolean, pattern: string, blockType: string): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IBlockMediator {
    hide(): void;
    showBlockDialog(): void;
    showChangeStateDialog(): void;
}
