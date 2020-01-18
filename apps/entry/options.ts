import BannedWords from '../option/banned_word';
import { BlockedSitesRepository } from '../repository/blocked_sites';
import BlockedSiteOption from '../option/blocked_site_option';
import { BannedWordRepository } from '../repository/banned_word_repository';
import { RegExpRepository } from '../repository/regexp_repository';
import { AutoBlockIDNOption, IBannedWordOption, OptionRepository } from '../repository/config';
import { Logger } from '../common';
import { RegExpList } from '../option/regexp';
import localizeHtmlPage from '../option/l10n';
import { exportClicked } from '../option/export';
import { importClicked } from '../option/import';

const softBlockList = document.getElementById('softBlockList') as HTMLDivElement;
const hardBlockList = document.getElementById('hardBlockList') as HTMLDivElement;
const clearButton = document.getElementById('clearButton') as HTMLInputElement;

// noinspection JSValidateTypes
/**
 * @type {HTMLInputElement}
 */
const developerCheckbox = document.getElementById('developerCheckbox') as HTMLInputElement;

const showBlockedByWordInfoCheckbox = document.getElementById('showBlockedByWordInfoCheckbox') as HTMLInputElement;
const autoBlockIDNCheckbox = document.getElementById('autoBlockIDNCheckBox') as HTMLInputElement;
const defaultBlockSelect = document.getElementById('defaultBlockType') as HTMLSelectElement;
const menuPositionSelect = document.getElementById('menuPosition') as HTMLSelectElement;

let bannedWords: BannedWords;
let regexpList: RegExpList;

async function show_lists(): Promise<void> {
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
    await show_lists();

    regexpList = new RegExpList();
    await regexpList.load();

    bannedWords = new BannedWords();
    await bannedWords.load();

    const developerMode: boolean = await OptionRepository.isDeveloperMode();
    Logger.log('developerMode is ', developerMode);
    developerCheckbox.checked = developerMode;

    const bannedWordOption: IBannedWordOption = await OptionRepository.getBannedWordOption();
    Logger.debug('bannedWordOption is ', bannedWordOption);
    showBlockedByWordInfoCheckbox.checked = bannedWordOption.showInfo;

    const autoBlockIDNOption: AutoBlockIDNOption = await OptionRepository.getAutoBlockIDNOption();
    Logger.debug('autoBlockIDNOption is ', autoBlockIDNOption);
    autoBlockIDNCheckbox.checked = autoBlockIDNOption.enabled;

    const defaultBlockType: string = await OptionRepository.defaultBlockType();
    Logger.debug('defaultBlockType is ', defaultBlockType);
    defaultBlockSelect.value = defaultBlockType;

    const menuPosition: string = await OptionRepository.menuPosition();
    Logger.debug('menuPosition is ', menuPosition);
    menuPositionSelect.value = menuPosition;
});

developerCheckbox.addEventListener('click', async (event) => {
    const checkbox = event.target as HTMLInputElement;

    await OptionRepository.setDeveloperMode(checkbox.checked);
});

showBlockedByWordInfoCheckbox.addEventListener('click', async (event) => {
    const checkbox = event.target as HTMLInputElement;

    await OptionRepository.setShowBlockedByWordInfo(checkbox.checked);
});

autoBlockIDNCheckbox.addEventListener('click', async (event) => {
    const checkbox = event.target as HTMLInputElement;

    const autoBlockIDN: AutoBlockIDNOption = { enabled: checkbox.checked };
    await OptionRepository.setAutoBlockIDNOption(autoBlockIDN);
});

defaultBlockSelect.addEventListener('change', async (event) => {
    const select = event.target as HTMLSelectElement;

    const { value } = select;
    await OptionRepository.setDefaultBlockType(value);
});

menuPositionSelect.addEventListener('change', async (event) => {
    const select = event.target as HTMLSelectElement;

    const { value } = select;
    await OptionRepository.setMenuPosition(value);
});

localizeHtmlPage();

document.getElementById('exportButton')!.addEventListener('click', exportClicked);
document.getElementById('importButton')!.addEventListener('click', importClicked);
