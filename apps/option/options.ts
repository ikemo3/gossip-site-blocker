/* global bannedWords, BannedWordRepository, BlockedSiteOption, BlockedSitesRepository, Logger,
   OptionRepository, RegExpRepository, regexpList */

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

    const developerMode: boolean = await OptionRepository.isDeveloperMode();
    Logger.log('developerMode is ', developerMode);
    developerCheckbox.checked = developerMode;

    const bannedWordOption: IBannedWordOption = await OptionRepository.getBannedWordOption();
    Logger.debug('bannedWordOption is ', bannedWordOption);
    showBlockedByWordInfoCheckbox.checked = bannedWordOption.showInfo;

    const autoBlockIDNOption: IAutoBlockIDNOption = await OptionRepository.getAutoBlockIDNOption();
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

    const autoBlockIDN: IAutoBlockIDNOption = { enabled: checkbox.checked };
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
