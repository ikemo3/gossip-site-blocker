import { By } from 'selenium-webdriver';
import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';

export default async function main(driver: TestWebDriver): Promise<void> {
    await driver.googleSearch(['switch', 'site:game.watch.impress.co.jp']);
    await driver.pause(500);
    await driver.takeScreenShot('test_google_search_top_news', 'search_result.png');

    // click 'block this page'
    const blockThisPage = await driver.querySelector('.block-google-top-news');
    const blockTarget = await blockThisPage.findElement(By.xpath('preceding-sibling::div'));
    await driver.pause(500);
    await driver.click(blockThisPage);
    await driver.takeScreenShot('test_google_search_top_news', 'block_dialog.png');

    // assert dialog
    const blockDialog = await driver.querySelector('.block-dialog');
    const domainRadio = await blockDialog.findElement(By.id('blocker-dialog-domain-radio'));
    strictEqual(await domainRadio.getAttribute('value'), 'game.watch.impress.co.jp');

    // click block button
    const blockButton = await driver.querySelector('.blocker-primary-button');
    await driver.pause(500);
    await driver.click(blockButton);
    await driver.takeScreenShot('test_google_search_top_news', 'block_clicked.png');

    // assert block target is hidden
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
