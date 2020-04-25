import { By, WebElement } from 'selenium-webdriver';
import { TestWebDriver } from '../driver';
import TestBlockAnchor from './block_anchor';

export default class TestCompactMenu {
    private readonly _driver: TestWebDriver;

    private readonly _anchorCss: string;

    constructor(driver: TestWebDriver, anchorCss: string) {
        this._driver = driver;
        this._anchorCss = anchorCss;
    }

    async click(): Promise<void> {
        const anchor = await this._driver.querySelector(this._anchorCss);
        await this._driver.click(anchor);
    }

    async clickToBlock(anchorCss: string): Promise<TestBlockAnchor> {
        return new TestBlockAnchor(this._driver, anchorCss);
    }

    async getTarget(targetXpath: string): Promise<WebElement> {
        const anchor = await this._driver.querySelector(this._anchorCss);
        return anchor.findElement(By.xpath(targetXpath));
    }
}
