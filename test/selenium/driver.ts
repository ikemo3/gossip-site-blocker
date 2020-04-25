import { By, WebDriver, WebElement } from 'selenium-webdriver';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

export enum DriverType {
    Chrome = 'chrome',
    Firefox = 'firefox',
}

class TestBlockDialog {
    private _driver: WebDriver;

    private _dialog: WebElement;

    constructor(driver: WebDriver) {
        this._driver = driver;
    }

    async init(): Promise<void> {
        this._dialog = await this._driver.findElement(By.css('.block-dialog'));
    }

    async getDomainRadioValue(): Promise<string> {
        const domainRadio = await this._dialog.findElement(By.id('blocker-dialog-domain-radio'));
        return domainRadio.getAttribute('value');
    }

    async block(): Promise<void> {
        const blockButton = await this._driver.findElement(By.css('.blocker-primary-button'));
        return this._driver.actions().click(blockButton).pause(500).perform();
    }
}

export class TestWebDriver {
    private readonly _driver: WebDriver;

    private readonly _driverType: DriverType;

    private _counter: number;

    constructor(driver: WebDriver, driverType: DriverType) {
        this._driver = driver;
        this._driverType = driverType;
        this._counter = 1;
    }

    async close(): Promise<void> {
        return this._driver.close();
    }

    async get(url: string): Promise<void> {
        await this._driver.get(url);
        return this.pause(500);
    }

    async googleSearch(keywords: string[]): Promise<void> {
        const query = keywords.join('+');
        await this._driver.get(`https://www.google.com/search?q=${query}`);
        return this.pause(1000);
    }

    async googleNewsSearch(keywords: string[]): Promise<void> {
        const query = keywords.join('+');
        await this._driver.get(`https://www.google.com/search?q=${query}&tbm=nws`);
        return this.pause(1000);
    }

    async googleImageSearch(keywords: string[]): Promise<void> {
        const query = keywords.join('+');
        await this._driver.get(`https://www.google.com/search?q=${query}&tbm=isch`);
        return this.pause(1000);
    }

    async querySelector(css: string): Promise<WebElement> {
        return this._driver.findElement(By.css(css));
    }

    async querySelectorAll(css: string): Promise<WebElement[]> {
        return this._driver.findElements(By.css(css));
    }

    async findDialog(): Promise<TestBlockDialog> {
        const dialog = new TestBlockDialog(this._driver);
        await dialog.init();

        return dialog;
    }

    async pause(milliSeconds: number): Promise<void> {
        return this._driver.actions().pause(milliSeconds).perform();
    }

    async click(button: WebElement): Promise<void> {
        return this._driver.actions().click(button).pause(500).perform();
    }

    async takeScreenShot(testName: string, filename: string): Promise<void> {
        const dir = `tmp/screenshots/${testName}/${this._driverType}`;

        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }

        const num = this._counter.toString().padStart(4, '0');
        writeFileSync(
            `${dir}/${num}_${filename}`,
            Buffer.from(await this._driver.takeScreenshot(), 'base64'),
        );
        this._counter += 1;
    }

    private async getLocalStorage<T>(key: string): Promise<T> {
        const js = `return (() => new Promise(r => chrome.storage.local.get('${key}', r)))();`;
        return this._driver.executeScript(js);
    }

    private async getShadowRoot(element: WebElement): Promise<WebElement> {
        return this._driver.executeScript('return arguments[0].shadowRoot', element);
    }

    private async getChromeExtensionId(): Promise<string> {
        await this.get('about:extensions');

        const manager = await this.querySelector('extensions-manager');
        const managerShadowRoot = await this.getShadowRoot(manager);

        const itemList = await managerShadowRoot.findElement(By.css('extensions-item-list'));
        const itemListShadowRoot = await this.getShadowRoot(itemList);

        const itemsContainer = await itemListShadowRoot.findElement(By.css('.items-container'));
        const item = await itemsContainer.findElement(By.css('extensions-item:nth-child(3)'));
        return item.getAttribute('id');
    }

    private async getFirefoxAddonId(): Promise<string> {
        await this.get('about:debugging#/runtime/this-firefox');

        const dd = await this.querySelector('.debug-target-list dl div:nth-child(2) dd');
        return dd.getText();
    }

    private async openOption(): Promise<void> {
        if (this._driverType === DriverType.Chrome) {
            const extensionId = await this.getChromeExtensionId();
            await this.get(`chrome-extension://${extensionId}/option/options.html`);
        } else if (this._driverType === DriverType.Firefox) {
            const extensionId = await this.getFirefoxAddonId();
            await this.get(`moz-extension://${extensionId}/option/options.html`);
        }
    }

    async changeOption<T>(key: string): Promise<T> {
        await this.openOption();

        const checkbox = await this.querySelector(`#${key}`);
        await this.click(checkbox);

        return this.getLocalStorage(key);
    }
}
