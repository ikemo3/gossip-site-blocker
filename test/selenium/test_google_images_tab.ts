import { By } from 'selenium-webdriver';
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
    const blockAnchor = await driver.querySelector('.block-anchor');
    const blockTarget = await blockAnchor.findElement(By.xpath('parent::div'));
    await driver.click(blockAnchor);
    await driver.takeScreenShot('test_google_images_tab', 'block_menu.png');

    // click 'block this page'
    const blockThisPage = await driver.querySelector('.block-operations-div');
    await driver.click(blockThisPage);
    await driver.takeScreenShot('test_google_images_tab', 'block_dialog.png');

    // assert dialog
    const blockDialog = await driver.findDialog();

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('test_google_images_tab', 'block_clicked.png');

    // assert block target is hidden
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
