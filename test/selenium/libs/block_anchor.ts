import { By, WebElement } from 'selenium-webdriver';
import { TestWebDriver } from '../driver';

export default class TestBlockAnchor {
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

    async getTarget(targetXpath: string): Promise<WebElement> {
        const anchor = await this._driver.querySelector(this._anchorCss);
        return anchor.findElement(By.xpath(targetXpath));
    }
}
