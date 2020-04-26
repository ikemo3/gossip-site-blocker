import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';

export default async function main(driver: TestWebDriver): Promise<void> {
    await driver.googleNewsSearch(['初音ミク', 'PR', 'TIMES']);
    await driver.takeScreenShot('search_result.png');

    // click 'block this page'
    const blockAnchor = await driver.blockAnchor('.block-google-news-top');
    await blockAnchor.click();
    await driver.takeScreenShot('block_dialog.png');

    // assert dialog
    const blockDialog = await driver.findDialog();
    strictEqual(await blockDialog.getDomainRadioValue(), 'prtimes.jp');

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('block_clicked.png');

    // assert block target is hidden
    const blockTarget = await blockAnchor.getTarget('preceding-sibling::div');
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
