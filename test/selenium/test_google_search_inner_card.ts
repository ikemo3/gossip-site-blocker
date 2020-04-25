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
    const blockDialog = await driver.findDialog();
    strictEqual(await blockDialog.getDomainRadioValue(), 'www.youtube.com');

    // click block button
    await blockDialog.block();
    await driver.takeScreenShot('test_inner_card', 'block_clicked.png');

    // assert block target is hidden
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}
