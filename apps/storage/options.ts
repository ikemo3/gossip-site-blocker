import { Logger } from "../libs/logger";
import BlockedSites from "../model/blocked_sites";
import { BannedWord, BannedWordRepository } from "./banned_words";
import BlockedSitesRepository from "./blocked_sites";
import { ChromeStorage } from "./chrome_storage";
import { MenuPositionType } from "./enums";
import { RegExpItem, RegExpRepository } from "./regexp_repository";

export interface OptionInterface<T> {
  load: () => Promise<T>;
  save: (value: T) => Promise<void>;
}

export const DeveloperMode = {
  load: async (): Promise<boolean> => {
    const items = await ChromeStorage.load({ developerMode: false });

    Logger.developerMode = items.developerMode;

    Logger.log("set 'developerMode' to =>", items.developerMode);

    return items.developerMode;
  },

  save: async (mode: boolean): Promise<void> => {
    await ChromeStorage.save({ developerMode: mode });

    Logger.developerMode = mode;

    Logger.log("set 'developerMode' to =>", mode);
  },
};

export const ShowBlockedByWordInfo = {
  load: async (): Promise<boolean> => {
    const items = await ChromeStorage.load({
      bannedWord: { showInfo: false },
    });

    return items.bannedWord.showInfo;
  },

  save: async (showBlockInfo: boolean): Promise<void> => {
    await ChromeStorage.save({ bannedWord: { showInfo: showBlockInfo } });

    Logger.debug("set 'showBlockInfo' to =>", showBlockInfo);
  },
};

export const AutoBlockIDN = {
  load: async (): Promise<boolean> => {
    const items = await ChromeStorage.load({
      autoBlockIDN: { enabled: false },
    });

    return items.autoBlockIDN.enabled;
  },

  save: async (autoBlockIDN: boolean): Promise<void> => {
    await ChromeStorage.save({ autoBlockIDN: { enabled: autoBlockIDN } });

    Logger.debug("set 'autoBlockIDN' to =>", autoBlockIDN);
  },
};

export const DefaultBlockType = {
  load: async (): Promise<string> => {
    const items = await ChromeStorage.load({ defaultBlockType: "soft" });

    return items.defaultBlockType;
  },

  save: async (defaultBlockType: string): Promise<void> => {
    await ChromeStorage.save({ defaultBlockType });

    Logger.log("set 'defaultBlockType' to =>", defaultBlockType);
  },
};

export const MenuPosition = {
  load: async (): Promise<MenuPositionType> => {
    const items = await ChromeStorage.load({ menuPosition: "default" });
    const { menuPosition } = items;

    switch (menuPosition) {
      case MenuPositionType.COMPACT:
        return MenuPositionType.COMPACT;
      case MenuPositionType.DEFAULT:
      default:
        return MenuPositionType.DEFAULT;
    }
  },

  save: async (menuPosition: string): Promise<void> => {
    await ChromeStorage.save({ menuPosition });

    Logger.debug("set 'menuPosition' to =>", menuPosition);
  },
};

export const DisplayTemporarilyUnblockAll = {
  load: async (): Promise<boolean> => {
    const items = await ChromeStorage.load({
      displayTemporarilyUnblockAll: true,
    });

    return items.displayTemporarilyUnblockAll;
  },

  save: async (displayTemporarilyUnblockAll: boolean): Promise<void> => {
    await ChromeStorage.save({ displayTemporarilyUnblockAll });

    Logger.debug(
      "set 'displayTemporarilyUnblockAll' to =>",
      displayTemporarilyUnblockAll,
    );
  },
};

export const BlockGoogleNewsTab = {
  load: async (): Promise<boolean> => {
    const items = await ChromeStorage.load({ blockGoogleNewsTab: true });

    return items.blockGoogleNewsTab;
  },

  save: async (blockGoogleNewsTab: boolean): Promise<void> => {
    await ChromeStorage.save({ blockGoogleNewsTab });

    Logger.debug("set 'blockGoogleNewsTab' to =>", blockGoogleNewsTab);
  },
};

export const BlockGoogleImagesTab = {
  load: async (): Promise<boolean> => {
    const items = await ChromeStorage.load({ blockGoogleImagesTab: true });

    return items.blockGoogleImagesTab;
  },

  save: async (blockGoogleImagesTab: boolean): Promise<void> => {
    await ChromeStorage.save({ blockGoogleImagesTab });

    Logger.debug("set 'blockGoogleImagesTab' to =>", blockGoogleImagesTab);
  },
};

export const BlockGoogleSearchMovie = {
  load: async (): Promise<boolean> => {
    const items = await ChromeStorage.load({ blockGoogleSearchMovie: true });

    return items.blockGoogleSearchMovie;
  },

  save: async (blockGoogleSearchMovie: boolean): Promise<void> => {
    await ChromeStorage.save({ blockGoogleSearchMovie });

    Logger.debug("set 'blockGoogleSearchMovie' to =>", blockGoogleSearchMovie);
  },
};

export interface Options {
  blockedSites: BlockedSites;
  bannedWords: BannedWord[];
  regexpList: RegExpItem[];
  autoBlockIDN: boolean;
  defaultBlockType: string;
  menuPosition: MenuPositionType;
  bannedWordOption: boolean;
  blockGoogleNewsTab: boolean;
  blockGoogleImagesTab: boolean;
  blockGoogleSearchMovie: boolean;
}

export async function loadOption(): Promise<Options> {
  await DeveloperMode.load();

  const blockedSites = await BlockedSitesRepository.load();
  const bannedWords = await BannedWordRepository.load();
  const regexpList = await RegExpRepository.load();
  const autoBlockIDN = await AutoBlockIDN.load();
  const defaultBlockType = await DefaultBlockType.load();
  const menuPosition = await MenuPosition.load();
  const bannedWordOption = await ShowBlockedByWordInfo.load();
  const blockGoogleNewsTab = await BlockGoogleNewsTab.load();
  const blockGoogleImagesTab = await BlockGoogleImagesTab.load();
  const blockGoogleSearchMovie = await BlockGoogleSearchMovie.load();
  Logger.debug("autoBlockIDNOption:", autoBlockIDN);

  return {
    blockedSites,
    bannedWords,
    regexpList,
    autoBlockIDN,
    defaultBlockType,
    menuPosition,
    bannedWordOption,
    blockGoogleNewsTab,
    blockGoogleImagesTab,
    blockGoogleSearchMovie,
  };
}
