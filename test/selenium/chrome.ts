import { Builder, Capabilities } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { readFileSync } from 'fs';
import { DriverType, TestWebDriver } from './driver';
import { TestCase } from './libs/interface';

export default function (testCase: TestCase<TestWebDriver>): TestWebDriver {
    const extension = readFileSync('tmp/workspace/gossip-site-blocker.crx', 'base64');
    const options = new Options().addExtensions(extension).windowSize({ width: 1280, height: 800 });

    const capabilities = Capabilities.chrome();
    capabilities.set('chromeOptions', {
        args: [
            '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
        ],
    });

    const driver = new Builder().withCapabilities(capabilities).setChromeOptions(options).build();
    return new TestWebDriver(driver, DriverType.Chrome, testCase);
}
