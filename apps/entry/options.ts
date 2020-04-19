import BannedWords from '../option/banned_word';
import BlockedSitesRepository from '../repository/blocked_sites';
import BlockedSiteOption from '../option/blocked_site_option';
import { BannedWordRepository } from '../repository/banned_word_repository';
import { RegExpRepository } from '../repository/regexp_repository';
import { OptionInterface, OptionRepository as Option } from '../repository/config';
import { Logger } from '../common';
import RegExpList from '../option/regexp';
import localizeHtmlPage from '../option/l10n';
import exportClicked from '../option/export';
import importClicked from '../option/import';

const softBlockList = document.getElementById('softBlockList') as HTMLDivElement;
const hardBlockList = document.getElementById('hardBlockList') as HTMLDivElement;
const clearButton = document.getElementById('clearButton') as HTMLInputElement;

type LoadFunc = () => Promise<boolean>;
type SetFunc = (value: boolean) => Promise<void>;
type LoadStringFunc = () => Promise<string>;
type SetStringFunc = (value: string) => Promise<void>;

async function initCheckbox(id: string, option: OptionInterface<boolean>): Promise<void> {
    const checkbox = document.getElementById(id);
    if (!(checkbox instanceof HTMLInputElement)) {
        throw new Error(`${id} is not HTMLInputElement`);
    }

    const value = await option.load();
    Logger.log(`${id} is `, value);
    checkbox.checked = value;

    checkbox.addEventListener('click', async () => {
        await option.save(checkbox.checked);
    });
}

async function initSelect(
    id: string,
    loadFunc: LoadStringFunc,
    setFunc: SetStringFunc,
): Promise<void> {
    const select = document.getElementById(id);
    if (!(select instanceof HTMLSelectElement)) {
        throw new Error(`${id} is not HTMLSelectElement`);
    }

    const value = await loadFunc();
    Logger.log(`${id} is `, value);
    select.value = value;

    select.addEventListener('change', async () => {
        await setFunc(select.value);
    });
}

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

    await initCheckbox('developerMode', Option.developerMode());

    await initCheckbox('displayTemporarilyUnblockAll', Option.displayTemporarilyUnblockAll());

    await initCheckbox('showBlockedByWordInfo', Option.showBlockedByWordInfo());

    await initCheckbox('autoBlockIDN', Option.autoBlockIDN());

    await initSelect('defaultBlockType', Option.defaultBlockType, Option.setDefaultBlockType);

    await initSelect('menuPosition', Option.menuPosition, Option.setMenuPosition);

    await initCheckbox('blockGoogleNewsTab', Option.blockGoogleNewsTab());
});

localizeHtmlPage();

document.getElementById('exportButton')!.addEventListener('click', exportClicked);
document.getElementById('importButton')!.addEventListener('click', importClicked);
