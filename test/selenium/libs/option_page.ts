import { By, WebElement } from 'selenium-webdriver';
import { DriverType, TestDriverInterface } from './interface';
import { MenuPosition } from '../../../apps/repository/enums';

export default class TestOptionPage {
    private readonly _driver: TestDriverInterface;

    private readonly _driverType: DriverType;

    constructor(driver: TestDriverInterface, driverType: DriverType) {
        this._driver = driver;
        this._driverType = driverType;
    }

    async getShadowRoot(element: WebElement): Promise<WebElement> {
        return this._driver.executeScript('return arguments[0].shadowRoot', element);
    }

    async getLocalStorage<T>(key: string): Promise<T> {
        const js = `return (() => new Promise(r => chrome.storage.local.get('${key}', r)))();`;
        return this._driver.executeScript(js);
    }

    private async getChromeExtensionId(): Promise<string> {
        await this._driver.get('chrome://extensions/');

        const manager = await this._driver.querySelector('extensions-manager');
        const managerShadowRoot = await this.getShadowRoot(manager);

        const itemList = await managerShadowRoot.findElement(By.css('extensions-item-list'));
        const itemListShadowRoot = await this.getShadowRoot(itemList);

        const itemsContainer = await itemListShadowRoot.findElement(By.css('.items-container'));
        const item = await itemsContainer.findElement(By.css('extensions-item'));
        return item.getAttribute('id');
    }

    private async getFirefoxAddonId(): Promise<string> {
        await this._driver.get('about:debugging#/runtime/this-firefox');

        const dd = await this._driver.querySelector('.debug-target-list dl div:nth-child(2) dd');
        return dd.getText();
    }

    private async openOption(): Promise<void> {
        if (this._driverType === DriverType.Chrome) {
            const extensionId = await this.getChromeExtensionId();
            await this._driver.get(`chrome-extension://${extensionId}/option/options.html`);
        } else if (this._driverType === DriverType.Firefox) {
            const extensionId = await this.getFirefoxAddonId();
            await this._driver.get(`moz-extension://${extensionId}/option/options.html`);
        }
    }

    async setMenuPosition(expected: MenuPosition): Promise<void> {
        interface MenuPositionConfig {
            menuPosition: string;
        }

        // open dialog
        await this.openOption();

        // Possible: true, false, undefined
        const current1: MenuPositionConfig = await this.getLocalStorage('menuPosition');
        if (current1.menuPosition === expected) {
            return;
        }

        const option1 = await this._driver.querySelector(
            `#menuPosition > option[value="${expected}"]`,
        );
        await this._driver.click(option1);

        const current2: MenuPositionConfig = await this.getLocalStorage('menuPosition');
        if (current2.menuPosition === expected) {
            return;
        }

        const menu2 = await this._driver.querySelector(`#menuPosition`);
        await this._driver.click(menu2);
    }

    async setBlockGoogleImagesTab(expected: boolean): Promise<void> {
        interface BlockGoogleImagesTab {
            blockGoogleImagesTab: boolean;
        }

        // open dialog
        await this.openOption();

        // Possible: true, false, undefined
        const current1: BlockGoogleImagesTab = await this.getLocalStorage('blockGoogleImagesTab');
        if (current1.blockGoogleImagesTab === expected) {
            return;
        }

        const checkbox1 = await this._driver.querySelector(`#blockGoogleImagesTab`);
        await this._driver.click(checkbox1);

        const current2: BlockGoogleImagesTab = await this.getLocalStorage('blockGoogleImagesTab');
        if (current2.blockGoogleImagesTab === expected) {
            return;
        }

        const checkbox2 = await this._driver.querySelector(`#blockGoogleImagesTab`);
        await this._driver.click(checkbox2);
    }
}
