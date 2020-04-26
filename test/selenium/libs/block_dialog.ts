import { By, WebDriver, WebElement } from 'selenium-webdriver';

export default class TestBlockDialog {
    private readonly _driver: WebDriver;

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
        await blockButton.click();
        await this._driver.sleep(500);
    }
}
