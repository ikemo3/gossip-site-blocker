import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';
import { MenuPosition } from '../../apps/common';

export async function googleSearchResult(driver: TestWebDriver): Promise<void> {
    // search
    await driver.googleSearch(['typescript', 'wikipedia', 'site:ja.wikipedia.org']);
    await driver.takeScreenShot('search_result.png');

    // click 'block this page'
    const blockAnchor = await driver.blockAnchor('.block-google-element');
    await blockAnchor.click();
    await driver.takeScreenShot('block_dialog.png');

    // assert dialog
    const blockDialog = await driver.findDialog();
    strictEqual(await blockDialog.getDomainRadioValue(), 'ja.wikipedia.org');

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('block_clicked.png');

    // assert block target is hidden
    const blockTarget = await blockAnchor.getTarget('preceding-sibling::div');
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}

export async function googleSearchResultCompactMenu(driver: TestWebDriver): Promise<void> {
    const optionPage = await driver.optionPage();

    // change menu to compact
    await optionPage.setMenuPosition(MenuPosition.COMPACT);

    // search
    await driver.googleSearch(['typescript', 'wikipedia', 'site:ja.wikipedia.org']);
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
    strictEqual(await blockDialog.getDomainRadioValue(), 'ja.wikipedia.org');

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('block_clicked.png');

    // assert block target is hidden
    const blockTarget = await compactMenu.getTarget('../../../../../div');
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
