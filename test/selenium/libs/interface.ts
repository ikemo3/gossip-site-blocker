import { WebElement } from "selenium-webdriver";

export enum DriverType {
    Chrome = "chrome",
    Firefox = "firefox",
}

export interface TestDriverInterface {
    click(button: WebElement): Promise<void>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    executeScript<T>(script: string, ...varArgs: any[]): Promise<T>;

    get(url: string): Promise<void>;

    pause(milliSeconds: number): Promise<void>;

    querySelector(css: string): Promise<WebElement>;
}

export type TestCase<T extends TestDriverInterface> = (driver: T) => Promise<void>;
