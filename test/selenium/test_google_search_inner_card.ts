import { By } from 'selenium-webdriver';
import { ok, strictEqual } from 'assert';
import { TestWebDriver } from './driver';

export default async function main(driver: TestWebDriver): Promise<void> {
    await driver.googleSearch(['自炊', '動画']);
    await driver.takeScreenShot('test_inner_card', 'search_result.png');

    // click 'block this page'
    const blockThisPage = await driver.querySelector('.block-google-inner-card');
    const blockTarget = await blockThisPage.findElement(
        By.xpath('preceding-sibling::g-inner-card'),
    );
    await driver.click(blockThisPage);
    await driver.takeScreenShot('test_inner_card', 'block_dialog.png');

    // assert dialog
    const blockDialog = await driver.querySelector('.block-dialog');
    const domainRadio = await blockDialog.findElement(By.id('blocker-dialog-domain-radio'));
    strictEqual(await domainRadio.getAttribute('value'), 'www.youtube.com');

    // click block button
    const blockButton = await driver.querySelector('.blocker-primary-button');
    await driver.click(blockButton);
    await driver.takeScreenShot('test_inner_card', 'block_clicked.png');

    // assert block target is hidden
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
