import { By, Capabilities, WebDriver, WebElement } from 'selenium-webdriver';
import { ok, strictEqual } from 'assert';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import chromeDriver from './chrome';

async function takeScreenShot(driver: WebDriver, path: string): Promise<void> {
    const capabilities: Capabilities = await driver.getCapabilities();
    const browserName = capabilities.get('browserName');

    const dir = `tmp/screenshots/test_google_images_tab/${browserName}`;

    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }

    writeFileSync(`${dir}/${path}`, Buffer.from(await driver.takeScreenshot(), 'base64'));
}

async function getShadowRoot(driver: WebDriver, element: WebElement): Promise<WebElement> {
    return driver.executeScript('return arguments[0].shadowRoot', element);
}

async function getLocalStorage<T>(driver: WebDriver, key: string): Promise<T> {
    const js = `return await (() => new Promise(r => chrome.storage.local.get('${key}', r)))()`;
    return driver.executeScript(js);
}

async function getExtensionId(driver: WebDriver): Promise<string> {
    await driver.get('about:extensions');

    const manager = await driver.findElement(By.css('extensions-manager'));
    const managerShadowRoot = await getShadowRoot(driver, manager);

    const itemList = await managerShadowRoot.findElement(By.css('extensions-item-list'));
    const itemListShadowRoot = await getShadowRoot(driver, itemList);

    const itemsContainer = await itemListShadowRoot.findElement(By.css('.items-container'));
    const item = await itemsContainer.findElement(By.css('extensions-item:nth-child(3)'));
    return item.getAttribute('id');
}

async function openOption(driver: WebDriver): Promise<void> {
    const extensionId = await getExtensionId(driver);

    await driver.get(`chrome-extension://${extensionId}/option/options.html`);
}

async function changeOption<T>(driver: WebDriver, key: string): Promise<T> {
    await openOption(driver);

    await driver.findElement(By.id(key)).click();
    return getLocalStorage(driver, key);
}

interface BlockGoogleImagesTab {
    blockGoogleImagesTab: boolean;
}

(async (): Promise<void> => {
    const driver = chromeDriver();
    try {
        // change checkbox to false
        const option: BlockGoogleImagesTab = await changeOption(driver, 'blockGoogleImagesTab');
        ok(!option.blockGoogleImagesTab);

        await driver.get('https://www.google.com/search?q=初音ミク&tbm=isch');
        const blockAnchors = await driver.findElements(By.className('block-anchor'));
        strictEqual(blockAnchors.length, 0);

        // change checkbox to true
        const option2: BlockGoogleImagesTab = await changeOption(driver, 'blockGoogleImagesTab');
        ok(option2.blockGoogleImagesTab);

        await driver.get('https://www.google.com/search?q=初音ミク+かわいい&tbm=isch');

        // click compact menu
        const blockAnchor = await driver.findElement(By.className('block-anchor'));
        const blockTarget = await blockAnchor.findElement(By.xpath('parent::div'));
        await driver.actions().pause(500).click(blockAnchor).perform();
        await takeScreenShot(driver, 'block_menu.png');

        // click 'block this page'
        const blockThisPage = await driver.findElement(By.className('block-operations-div'));
        await driver.actions().pause(500).click(blockThisPage).perform();

        // assert dialog
        const blockDialog = await driver.findElement(By.className('block-dialog'));

        // click block button
        const blockButton = await blockDialog.findElement(By.className('blocker-primary-button'));
        await driver.actions().pause(500).click(blockButton).perform();
        await takeScreenShot(driver, 'block_clicked.png');

        // assert block target is hidden
        const isDisplayed = await blockTarget.isDisplayed();
        ok(!isDisplayed);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    } finally {
        await driver.close();
    }
})();
