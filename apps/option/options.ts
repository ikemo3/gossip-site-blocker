const softBlockList = document.getElementById("softBlockList") as HTMLDivElement;
const hardBlockList = document.getElementById("hardBlockList") as HTMLDivElement;
const clearButton = document.getElementById("clearButton") as HTMLInputElement;

// noinspection JSValidateTypes
/**
 * @type {HTMLInputElement}
 */
const developerCheckbox = document.getElementById("developerCheckbox") as HTMLInputElement;

const autoBlockIDNCheckbox = document.getElementById("autoBlockIDNCheckBox") as HTMLInputElement;

async function show_lists() {
    const sites = await BlockedSitesRepository.load();

    // Add after clear.
    softBlockList.innerHTML = "";
    hardBlockList.innerHTML = "";

    const softTable = document.createElement("table");
    const hardTable = document.createElement("table");
    for (const site of sites) {
        const option = new BlockedSiteOption(site);

        if (option.getState() === "soft") {
            softTable.appendChild(option.getElement());
        } else {
            hardTable.appendChild(option.getElement());
        }
    }

    softBlockList.appendChild(softTable);
    hardBlockList.appendChild(hardTable);
}

async function clear() {
    if (confirm(chrome.i18n.getMessage("clearConfirm"))) {
        await BlockedSitesRepository.clear();
        await BannedWordRepository.clear();

        alert(chrome.i18n.getMessage("clearDone"));

        // clear all.
        softBlockList.innerHTML = "";
        hardBlockList.innerHTML = "";
        bannedWords.clear();
    }
}

// bind event.
clearButton.addEventListener("click", clear);

document.addEventListener("DOMContentLoaded", async (ignore) => {
    await show_lists();

    const developerMode: boolean = await OptionRepository.isDeveloperMode();
    Logger.log("developerMode is ", developerMode);
    developerCheckbox.checked = developerMode;

    const autoBlockIDNOption: IAutoBlockIDNOption = await OptionRepository.getAutoBlockIDNOption();
    autoBlockIDNCheckbox.checked = autoBlockIDNOption.enabled;
});

developerCheckbox.addEventListener("click", async (event) => {
    const checkbox = event.target as HTMLInputElement;

    await OptionRepository.setDeveloperMode(checkbox.checked);
});

autoBlockIDNCheckbox.addEventListener("click", async (event) => {
    const checkbox = event.target as HTMLInputElement;

    const autoBlockIDN: IAutoBlockIDNOption = {enabled: checkbox.checked};
    await OptionRepository.setAutoBlockIDNOption(autoBlockIDN);
});
