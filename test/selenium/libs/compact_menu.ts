import { By, WebDriver, WebElement, WebElementPromise } from 'selenium-webdriver';
import TestBlockAnchor from './block_anchor';

export default class TestCompactMenu {
    private readonly _driver: WebDriver;

    private readonly _anchor: WebElementPromise;

    constructor(driver: WebDriver, anchorCss: string) {
        this._driver = driver;
        this._anchor = this._driver.findElement(By.css(anchorCss));
    }

    async click(): Promise<void> {
        await this._anchor.click();
    }

    async clickToBlock(anchorCss: string): Promise<TestBlockAnchor> {
        const anchor = this._driver.findElement(By.css(anchorCss));
        return new TestBlockAnchor(this._driver, anchor);
    }

    async getTarget(targetXpath: string): Promise<WebElement> {
        return this._anchor.findElement(By.xpath(targetXpath));
    }
}
