import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';
import TestBlockAnchor from './libs/block_anchor';

export default async function main(driver: TestWebDriver): Promise<void> {
    await driver.googleSearch(['switch', 'site:game.watch.impress.co.jp']);
    await driver.takeScreenShot('test_google_search_top_news', 'search_result.png');

    // click 'block this page'
    const blockAnchor = new TestBlockAnchor(driver, '.block-google-top-news');
    await blockAnchor.click();
    await driver.takeScreenShot('test_google_search_top_news', 'block_dialog.png');

    // assert dialog
    const blockDialog = await driver.findDialog();
    strictEqual(await blockDialog.getDomainRadioValue(), 'game.watch.impress.co.jp');

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('test_google_search_top_news', 'block_clicked.png');

    // assert block target is hidden
    const blockTarget = await blockAnchor.getTarget('preceding-sibling::div');
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
