import {
    Builder, By, Capabilities, WebDriver,
} from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { readFileSync } from 'fs';
import { ok, strictEqual } from 'assert';

(async (): Promise<void> => {
    try {
        const extension = readFileSync('tmp/workspace/gossip-site-blocker.crx', 'base64');
        const options = new Options()
            .addExtensions(extension)
            .windowSize({ width: 1280, height: 800 });

        const capabilities = Capabilities.chrome();
        capabilities.set('chromeOptions', {
            args: [
                '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
            ],
        });

        const driver: WebDriver = await new Builder()
            .withCapabilities(capabilities)
            .setChromeOptions(options)
            .build();

        await driver.get('https://www.google.com/search?q=typescript+wikipedia');

        // click 'block this page'
        const blockThisPage = driver.findElement(By.className('block-google-element'));
        const blockTarget = blockThisPage.findElement(By.xpath('preceding-sibling::div'));
        await driver.actions().pause(500).click(blockThisPage).perform();

        // assert dialog
        const blockDialog = driver.findElement(By.className('block-dialog'));
        const domainRadio = blockDialog.findElement(By.id('blocker-dialog-domain-radio'));
        strictEqual(await domainRadio.getAttribute('value'), 'ja.wikipedia.org');

        // click block button
        const blockButton = driver.findElement(By.className('blocker-primary-button'));
        await driver.actions().pause(500).click(blockButton).perform();

        // assert block target is hidden
        const isDisplayed = await blockTarget.isDisplayed();
        ok(!isDisplayed);

        // quit driver.
        await driver.close();
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    }
})();
