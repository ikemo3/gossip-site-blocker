import { By } from 'selenium-webdriver';
import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';

interface BlockGoogleImagesTab {
    blockGoogleImagesTab: boolean;
}

export default async function main(driver: TestWebDriver): Promise<void> {
    // change checkbox to false
    const option: BlockGoogleImagesTab = await driver.changeOption('blockGoogleImagesTab');
    ok(!option.blockGoogleImagesTab);

    await driver.googleImageSearch(['初音ミク', 'かわいい']);
    const blockAnchors = await driver.querySelectorAll('.block-anchor');
    strictEqual(blockAnchors.length, 0);

    // change checkbox to true
    const option2: BlockGoogleImagesTab = await driver.changeOption('blockGoogleImagesTab');
    ok(option2.blockGoogleImagesTab);

    await driver.googleImageSearch(['初音ミク', 'かわいい']);

    // click compact menu
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
