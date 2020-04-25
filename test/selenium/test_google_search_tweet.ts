import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';
import TestBlockAnchor from './libs/block_anchor';

export default async function main(driver: TestWebDriver): Promise<void> {
    await driver.googleSearch(['hyuki']);
    await driver.takeScreenShot('test_tweet', 'search_result.png');

    // click 'block this page'
    const blockAnchor = new TestBlockAnchor(driver, '.block-google-inner-card');
    await blockAnchor.click();
    await driver.takeScreenShot('test_tweet', 'block_dialog.png');

    // assert dialog
    const blockDialog = await driver.findDialog();
    strictEqual(await blockDialog.getDomainRadioValue(), 'twitter.com');

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('test_tweet', 'block_clicked.png');

    // assert block target is hidden
    const blockTarget = await blockAnchor.getTarget('preceding-sibling::g-inner-card');
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
