import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';
import TestBlockAnchor from './libs/block_anchor';

export default async function main(driver: TestWebDriver): Promise<void> {
    await driver.googleNewsSearch(['初音ミク', 'PR', 'TIMES']);
    await driver.takeScreenShot('test_google_news_tab_top', 'search_result.png');

    // click 'block this page'
    const blockAnchor = new TestBlockAnchor(driver, '.block-google-news-top');
    await blockAnchor.click();
    await driver.takeScreenShot('test_google_news_tab_top', 'block_dialog.png');

    // assert dialog
    const blockDialog = await driver.findDialog();
    strictEqual(await blockDialog.getDomainRadioValue(), 'prtimes.jp');

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('test_google_news_tab_top', 'block_clicked.png');

    // assert block target is hidden
    const blockTarget = await blockAnchor.getTarget('preceding-sibling::div');
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
