import { By } from 'selenium-webdriver';
import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';

export default async function main(driver: TestWebDriver): Promise<void> {
    await driver.googleNewsSearch(['初音ミク', 'PR', 'TIMES']);
    await driver.takeScreenShot('test_google_news_tab_top', 'search_result.png');

    // click 'block this page'
    const blockThisPage = await driver.querySelector('.block-google-news-top');
    const blockTarget = await blockThisPage.findElement(By.xpath('preceding-sibling::div'));
    await driver.click(blockThisPage);
    await driver.takeScreenShot('test_google_news_tab_top', 'block_dialog.png');

    // assert dialog
    const blockDialog = await driver.findDialog();
    strictEqual(await blockDialog.getDomainRadioValue(), 'prtimes.jp');

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('test_google_news_tab_top', 'block_clicked.png');

    // assert block target is hidden
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
