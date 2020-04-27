import { By, WebDriver, WebElement, WebElementPromise } from 'selenium-webdriver';

export default class TestBlockAnchor {
    private readonly _driver: WebDriver;

    private readonly _anchorCss: string;

    private readonly _anchor: WebElementPromise;

    constructor(driver: WebDriver, anchor: WebElementPromise) {
        this._driver = driver;
        this._anchor = anchor;
    }

    async click(): Promise<void> {
        await this._anchor.click();
    }

    async getTarget(targetXpath: string): Promise<WebElement> {
        return this._anchor.findElement(By.xpath(targetXpath));
    }

    async isGone(): Promise<boolean> {
        try {
            await this._anchor.click();
            return false;
        } catch (StaleElementReferenceError) {
            return true;
        }
    }
}
