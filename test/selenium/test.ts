import { By, Capabilities, WebDriver } from 'selenium-webdriver';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { ok, strictEqual } from 'assert';
import chromeDriver from './chrome';
import firefoxDriver from './firefox';

async function takeScreenShot(driver: WebDriver, path: string): Promise<void> {
    const capabilities: Capabilities = await driver.getCapabilities();
    const browserName = capabilities.get('browserName');

    const dir = `tmp/screenshots/${browserName}`;

    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }

    writeFileSync(`${dir}/${path}`, Buffer.from(await driver.takeScreenshot(), 'base64'));
}

async function main(driver: WebDriver): Promise<void> {
    await driver.get('https://www.google.com/search?q=typescript+wikipedia+site:ja.wikipedia.org');
    await takeScreenShot(driver, 'search_result.png');

    // click 'block this page'
    const blockThisPage = driver.findElement(By.className('block-google-element'));
    const blockTarget = blockThisPage.findElement(By.xpath('preceding-sibling::div'));
    await driver.actions().pause(500).click(blockThisPage).perform();
    await takeScreenShot(driver, 'block_dialog.png');

    // assert dialog
    const blockDialog = driver.findElement(By.className('block-dialog'));
    const domainRadio = blockDialog.findElement(By.id('blocker-dialog-domain-radio'));
    strictEqual(await domainRadio.getAttribute('value'), 'ja.wikipedia.org');

    // click block button
    const blockButton = driver.findElement(By.className('blocker-primary-button'));
    await driver.actions().pause(500).click(blockButton).perform();
    await takeScreenShot(driver, 'block_clicked.png');

    // assert block target is hidden
    const isDisplayed = await blockTarget.isDisplayed();
    ok(!isDisplayed);
}

(async (): Promise<void> => {
    const driver = chromeDriver();
    try {
        await main(driver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    } finally {
        await driver.close();
    }
})();

(async (): Promise<void> => {
    const driver = firefoxDriver();
    try {
        await main(driver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    } finally {
        await driver.close();
    }
})();
