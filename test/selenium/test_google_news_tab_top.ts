import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';
import { BlockType, MenuPosition } from '../../apps/common';

async function googleNewsTabTop(driver: TestWebDriver, isSoft: boolean): Promise<void> {
    // search
    await driver.googleNewsSearch(['初音ミク', 'PR', 'TIMES']);
    await driver.takeScreenShot('search_result.png');

    // click 'block this page'
    const blockAnchor = await driver.blockAnchor('.block-google-card');
    await blockAnchor.click();
    await driver.takeScreenShot('block_dialog.png');

    // assert dialog
    const blockDialog = await driver.findDialog();
    strictEqual(await blockDialog.getDomainRadioValue(), 'prtimes.jp');

    if (!isSoft) {
        // set select to hard
        await blockDialog.setType(BlockType.HARD);
    }

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('block_clicked.png');

    if (isSoft) {
        // assert block target is hidden
        const blockTarget = await blockAnchor.getTarget('preceding-sibling::g-card');
        const isDisplayed = await blockTarget.isDisplayed();
        ok(!isDisplayed);
    } else {
        // assert block target is gone
        ok(await blockAnchor.isGone());
    }
}

export async function googleNewsTabTopSoftBlock(driver: TestWebDriver): Promise<void> {
    return googleNewsTabTop(driver, true);
}

export async function googleNewsTabTopHardBlock(driver: TestWebDriver): Promise<void> {
    return googleNewsTabTop(driver, false);
}

export async function googleNewsTabTopCompactMenu(driver: TestWebDriver): Promise<void> {
    const optionPage = await driver.optionPage();

    // change menu to compact
    await optionPage.setMenuPosition(MenuPosition.COMPACT);

    // search
    await driver.googleNewsSearch(['初音ミク', 'PR', 'TIMES']);
    await driver.takeScreenShot('search_result.png');

    // click compact menu
    const compactMenu = await driver.compactMenu('.block-anchor a');
    await compactMenu.click();
    await driver.takeScreenShot('block_menu.png');

    // click 'block this page'
    const blockAnchor = await compactMenu.clickToBlock('.block-operations-div a:nth-child(2)');
    await blockAnchor.click();
    await driver.takeScreenShot('block_dialog.png');

    // assert dialog
    const blockDialog = await driver.findDialog();
    strictEqual(await blockDialog.getDomainRadioValue(), 'prtimes.jp');

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('block_clicked.png');

    // assert block target is hidden
    const blockTarget = await compactMenu.getTarget('../..');
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
