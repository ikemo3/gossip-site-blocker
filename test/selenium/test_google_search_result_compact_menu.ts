import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';
import { MenuPosition } from '../../apps/common';
import chromeDriver from './chrome';
import TestCompactMenu from './libs/compact_menu';

async function main(driver: TestWebDriver): Promise<void> {
    const optionPage = await driver.optionPage();

    // change menu to compact
    await optionPage.setMenuPosition(MenuPosition.COMPACT);

    // search
    await driver.googleSearch(['typescript', 'wikipedia', 'site:ja.wikipedia.org']);
    await driver.takeScreenShot('search_result.png');

    // click compact menu
    const compactMenu = new TestCompactMenu(driver, '.block-anchor');
    await compactMenu.click();
    await driver.takeScreenShot('block_menu.png');

    // click 'block this page'
    const blockAnchor = await compactMenu.clickToBlock('.block-operations-div');
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

(async (): Promise<void> => {
    const testDriver = chromeDriver();
    try {
        await main(testDriver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    } finally {
        await testDriver.close();
    }
})();
