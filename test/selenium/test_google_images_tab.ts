import { ok, strictEqual } from "assert";
import { TestWebDriver } from "./driver";
import { BlockType } from "../../apps/repository/enums";

async function googleImagesTab(driver: TestWebDriver, isSoft: boolean): Promise<void> {
    // click compact menu
    await driver.googleImageSearch(["初音ミク", "かわいい"]);
    const compactMenu = await driver.compactMenu(".block-anchor a");
    await compactMenu.click();
    await driver.takeScreenShot("block_menu.png");

    // click 'block this page'
    const blockAnchor = await compactMenu.clickToBlock(".block-operations-div a:nth-child(2)");
    await blockAnchor.click();
    await driver.takeScreenShot("block_dialog.png");

    // assert dialog
    const blockDialog = await driver.findDialog();

    if (!isSoft) {
        // set select to hard
        await blockDialog.setType(BlockType.HARD);
    }

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot("block_clicked.png");

    if (isSoft) {
        // assert block target is hidden
        const blockTarget = await compactMenu.getTarget("../..");
        const isDisplayed = await blockTarget.isDisplayed();
        ok(!isDisplayed);
    } else {
        // assert block target is gone
        ok(await blockAnchor.isGone());
    }
}

export async function googleImagesTabSoftBlock(driver: TestWebDriver): Promise<void> {
    return googleImagesTab(driver, true);
}

export async function googleImagesTabHardBlock(driver: TestWebDriver): Promise<void> {
    return googleImagesTab(driver, false);
}

export async function googleImagesTabOff(driver: TestWebDriver): Promise<void> {
    const optionPage = await driver.optionPage();

    // change option to false
    await optionPage.setBlockGoogleImagesTab(false);

    // cannot block
    await driver.googleImageSearch(["初音ミク", "かわいい"]);
    const blockAnchors = await driver.querySelectorAll(".block-anchor");
    strictEqual(blockAnchors.length, 0);
}
