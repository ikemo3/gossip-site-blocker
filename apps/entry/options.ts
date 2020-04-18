import BannedWords from '../option/banned_word';
import BlockedSitesRepository from '../repository/blocked_sites';
import BlockedSiteOption from '../option/blocked_site_option';
import { BannedWordRepository } from '../repository/banned_word_repository';
import { RegExpRepository } from '../repository/regexp_repository';
import {
    AutoBlockIDNOption,
    BannedWordOption,
    OptionRepository as Option,
} from '../repository/config';
import { Logger } from '../common';
import RegExpList from '../option/regexp';
import localizeHtmlPage from '../option/l10n';
import exportClicked from '../option/export';
import importClicked from '../option/import';

const softBlockList = document.getElementById('softBlockList') as HTMLDivElement;
const hardBlockList = document.getElementById('hardBlockList') as HTMLDivElement;
const clearButton = document.getElementById('clearButton') as HTMLInputElement;

// noinspection JSValidateTypes
/**
 * @type {HTMLInputElement}
 */
const developerCheckbox = document.getElementById('developerCheckbox') as HTMLInputElement;

const displayTemporarilyUnblockAllCheckbox = document.getElementById(
    'displayTemporarilyUnblockAllCheckbox',
) as HTMLInputElement;
const showBlockedByWordInfoCheckbox = document.getElementById(
    'showBlockedByWordInfoCheckbox',
) as HTMLInputElement;
const autoBlockIDNCheckbox = document.getElementById('autoBlockIDNCheckBox') as HTMLInputElement;
const defaultBlockSelect = document.getElementById('defaultBlockType') as HTMLSelectElement;
const menuPositionSelect = document.getElementById('menuPosition') as HTMLSelectElement;
const blockGoogleNewsTabCheckbox = document.getElementById(
    'blockGoogleNewsTabCheckbox',
) as HTMLInputElement;

let bannedWords: BannedWords;
let regexpList: RegExpList;

async function showLists(): Promise<void> {
    const sites = await BlockedSitesRepository.load();

    // Add after clear.
    softBlockList.innerHTML = '';
    hardBlockList.innerHTML = '';

    const softTable = document.createElement('table');
    const hardTable = document.createElement('table');
    for (const site of sites) {
        const option = new BlockedSiteOption(site);

        if (option.getState() === 'soft') {
            softTable.appendChild(option.getElement());
        } else {
            hardTable.appendChild(option.getElement());
        }
    }

    softBlockList.appendChild(softTable);
    hardBlockList.appendChild(hardTable);
}

async function clear(): Promise<void> {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (confirm(chrome.i18n.getMessage('clearConfirm'))) {
        await BlockedSitesRepository.clear();
        await BannedWordRepository.clear();
        await RegExpRepository.clear();

        // eslint-disable-next-line no-alert
        alert(chrome.i18n.getMessage('clearDone'));

        // clear all.
        softBlockList.innerHTML = '';
        hardBlockList.innerHTML = '';
        bannedWords.clear();
        regexpList.clear();
    }
}

// bind event.
clearButton.addEventListener('click', clear);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
document.addEventListener('DOMContentLoaded', async (ignore) => {
    await showLists();

    regexpList = new RegExpList();
    await regexpList.load();

    bannedWords = new BannedWords();
    await bannedWords.load();

    const developerMode: boolean = await Option.isDeveloperMode();
    Logger.log('developerMode is ', developerMode);
    developerCheckbox.checked = developerMode;

    const displayTemporarilyUnblockAll: boolean = await Option.isDisplayTemporarilyUnblockAll();
    Logger.debug('displayTemporarilyUnblockAll is ', displayTemporarilyUnblockAll);
    displayTemporarilyUnblockAllCheckbox.checked = displayTemporarilyUnblockAll;

    const bannedWordOption: BannedWordOption = await Option.getBannedWordOption();
    Logger.debug('bannedWordOption is ', bannedWordOption);
    showBlockedByWordInfoCheckbox.checked = bannedWordOption.showInfo;

    const autoBlockIDNOption: AutoBlockIDNOption = await Option.getAutoBlockIDNOption();
    Logger.debug('autoBlockIDNOption is ', autoBlockIDNOption);
    autoBlockIDNCheckbox.checked = autoBlockIDNOption.enabled;

    const defaultBlockType: string = await Option.defaultBlockType();
    Logger.debug('defaultBlockType is ', defaultBlockType);
    defaultBlockSelect.value = defaultBlockType;

    const menuPosition: string = await Option.menuPosition();
    Logger.debug('menuPosition is ', menuPosition);
    menuPositionSelect.value = menuPosition;

    const blockGoogleNewsTab: boolean = await Option.isBlockGoogleNewsTab();
    Logger.debug('blockGoogleNewsTab is ', blockGoogleNewsTab);
    blockGoogleNewsTabCheckbox.checked = blockGoogleNewsTab;
});

developerCheckbox.addEventListener('click', async (event) => {
    const checkbox = event.target as HTMLInputElement;

    await Option.setDeveloperMode(checkbox.checked);
});

displayTemporarilyUnblockAllCheckbox.addEventListener('click', async (event) => {
    const checkbox = event.target as HTMLInputElement;

    await Option.setDisplayTemporarilyUnblockAll(checkbox.checked);
});

showBlockedByWordInfoCheckbox.addEventListener('click', async (event) => {
    const checkbox = event.target as HTMLInputElement;

    await Option.setShowBlockedByWordInfo(checkbox.checked);
});

autoBlockIDNCheckbox.addEventListener('click', async (event) => {
    const checkbox = event.target as HTMLInputElement;

    const autoBlockIDN: AutoBlockIDNOption = { enabled: checkbox.checked };
    await Option.setAutoBlockIDNOption(autoBlockIDN);
});

defaultBlockSelect.addEventListener('change', async (event) => {
    const select = event.target as HTMLSelectElement;

    const { value } = select;
    await Option.setDefaultBlockType(value);
});

menuPositionSelect.addEventListener('change', async (event) => {
    const select = event.target as HTMLSelectElement;

    const { value } = select;
    await Option.setMenuPosition(value);
});

blockGoogleNewsTabCheckbox.addEventListener('click', async (event) => {
    const checkbox = event.target as HTMLInputElement;

    await Option.setBlockGoogleNewsTab(checkbox.checked);
});

localizeHtmlPage();

document.getElementById('exportButton')!.addEventListener('click', exportClicked);
document.getElementById('importButton')!.addEventListener('click', importClicked);
