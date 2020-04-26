import { By, WebDriver, WebElement } from 'selenium-webdriver';
import TestBlockAnchor from './block_anchor';

export default class TestCompactMenu {
    private readonly _driver: WebDriver;

    private readonly _anchorCss: string;

    constructor(driver: WebDriver, anchorCss: string) {
        this._driver = driver;
        this._anchorCss = anchorCss;
    }

    async click(): Promise<void> {
        const anchor = await this._driver.findElement(By.css(this._anchorCss));
        await anchor.click();
    }

    async clickToBlock(anchorCss: string): Promise<TestBlockAnchor> {
        return new TestBlockAnchor(this._driver, anchorCss);
    }

    async getTarget(targetXpath: string): Promise<WebElement> {
        const anchor = await this._driver.findElement(By.css(this._anchorCss));
        return anchor.findElement(By.xpath(targetXpath));
    }
}
