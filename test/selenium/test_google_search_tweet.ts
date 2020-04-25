import { By } from 'selenium-webdriver';
import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';

export default async function main(driver: TestWebDriver): Promise<void> {
    await driver.googleSearch(['hyuki']);
    await driver.takeScreenShot('test_tweet', 'search_result.png');

    // click 'block this page'
    const blockThisPage = await driver.querySelector('.block-google-inner-card');
    const blockTarget = await blockThisPage.findElement(
        By.xpath('preceding-sibling::g-inner-card'),
    );
    await driver.click(blockThisPage);
    await driver.takeScreenShot('test_tweet', 'block_dialog.png');

    // assert dialog
    const domainRadio = await driver.querySelector('.block-dialog #blocker-dialog-domain-radio');
    strictEqual(await domainRadio.getAttribute('value'), 'twitter.com');

    // click block button
    const blockButton = await driver.querySelector('.blocker-primary-button');
    await driver.click(blockButton);
    await driver.takeScreenShot('test_tweet', 'block_clicked.png');

    // assert block target is hidden
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
