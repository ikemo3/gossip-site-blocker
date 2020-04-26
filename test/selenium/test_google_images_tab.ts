import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';

export default async function main(driver: TestWebDriver): Promise<void> {
    const optionPage = await driver.optionPage();

    // change option to false
    await optionPage.setBlockGoogleImagesTab(false);

    // cannot block
    await driver.googleImageSearch(['初音ミク', 'かわいい']);
    const blockAnchors = await driver.querySelectorAll('.block-anchor');
    strictEqual(blockAnchors.length, 0);

    // change option to true
    await optionPage.setBlockGoogleImagesTab(true);

    // click compact menu
    await driver.googleImageSearch(['初音ミク', 'かわいい']);
    const compactMenu = await driver.compactMenu('.block-anchor');
    await compactMenu.click();
    await driver.takeScreenShot('block_menu.png');

    // click 'block this page'
    const blockAnchor = await compactMenu.clickToBlock('.block-operations-div');
    await blockAnchor.click();
    await driver.takeScreenShot('block_dialog.png');

    // assert dialog
    const blockDialog = await driver.findDialog();

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('block_clicked.png');

    // assert block target is hidden
    const blockTarget = await compactMenu.getTarget('parent::div');
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
