import { By, until, WebDriver, WebElement } from 'selenium-webdriver';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { DriverType, TestCase, TestDriverInterface } from './libs/interface';
import TestOptionPage from './libs/option_page';
import TestBlockDialog from './libs/block_dialog';
import TestBlockAnchor from './libs/block_anchor';
import TestCompactMenu from './libs/compact_menu';

export { DriverType } from './libs/interface';

export class TestWebDriver implements TestDriverInterface {
    private readonly _driver: WebDriver;

    private readonly _driverType: DriverType;

    private readonly _testCase: TestCase<TestWebDriver>;

    private _counter: number;

    constructor(driver: WebDriver, driverType: DriverType, testCase: TestCase<TestWebDriver>) {
        this._driver = driver;
        this._driverType = driverType;
        this._testCase = testCase;
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
        return this.pause(2000);
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
        await this._driver.sleep(milliSeconds);
    }

    async click(element: WebElement): Promise<void> {
        // cannot use Actions API for <select>.
        await element.click();
        await this._driver.sleep(500);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async executeScript<T>(script: string, ...varArgs: any[]): Promise<T> {
        return this._driver.executeScript(script, ...varArgs);
    }

    async takeScreenShot(filename: string): Promise<void> {
        // get directory from test case
        const testFuncName = this._testCase.name;

        // create dir if not exist
        const dir = `tmp/screenshots/${testFuncName}/${this._driverType}`;
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }

        // generate numbered filename
        const num = this._counter.toString().padStart(4, '0');
        const numberedFilename = `${num}_${filename}`;
        this._counter += 1;

        // write screenshot to file
        const buffer = Buffer.from(await this._driver.takeScreenshot(), 'base64');
        writeFileSync(`${dir}/${numberedFilename}`, buffer);
    }

    async blockAnchor(anchorCss: string): Promise<TestBlockAnchor> {
        const anchor = this._driver.wait(until.elementLocated(By.css(anchorCss)));
        return new TestBlockAnchor(this._driver, anchor);
    }

    async compactMenu(anchorCss: string): Promise<TestCompactMenu> {
        return new TestCompactMenu(this._driver, anchorCss);
    }

    async optionPage(): Promise<TestOptionPage> {
        return new TestOptionPage(this, this._driverType);
    }
}
