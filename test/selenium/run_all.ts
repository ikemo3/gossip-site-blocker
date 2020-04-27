import chromeDriver from './chrome';
import firefoxDriver from './firefox';
import {
    googleSearchResultSoftBlock,
    googleSearchResultHardBlock,
    googleSearchResultCompactMenu,
} from './test_google_search_result';
import {
    googleSearchInnerCardSoftBlock,
    googleSearchInnerCardHardBlock,
    googleSearchInnerCardCompactMenu,
} from './test_google_search_inner_card';
import {
    googleSearchTopNewsSoftBlock,
    googleSearchTopNewsHardBlock,
    googleSearchTopNewsCompactMenu,
} from './test_google_search_top_news';
import {
    googleSearchTweetSoftBlock,
    googleSearchTweetHardBlock,
    googleSearchTweetCompactMenu,
} from './test_google_search_tweet';
import {
    googleNewsTabTopSoftBlock,
    googleNewsTabTopHardBlock,
    googleNewsTabTopCompactMenu,
} from './test_google_news_tab_top';
import { googleImagesTabSoftBlock, googleImagesTabHardBlock } from './test_google_images_tab';
import { TestWebDriver } from './driver';
import { TestCase } from './libs/interface';

const testCases = [
    googleSearchResultSoftBlock,
    googleSearchResultHardBlock,
    googleSearchResultCompactMenu,
    googleSearchInnerCardSoftBlock,
    googleSearchInnerCardHardBlock,
    googleSearchInnerCardCompactMenu,
    googleSearchTopNewsSoftBlock,
    googleSearchTopNewsHardBlock,
    googleSearchTopNewsCompactMenu,
    googleSearchTweetSoftBlock,
    googleSearchTweetHardBlock,
    googleSearchTweetCompactMenu,
    googleNewsTabTopSoftBlock,
    googleNewsTabTopHardBlock,
    googleNewsTabTopCompactMenu,
    googleImagesTabSoftBlock,
    googleImagesTabHardBlock,
];

async function runTestWithChrome(testCase: TestCase<TestWebDriver>): Promise<void> {
    const testDriver = chromeDriver(testCase);
    try {
        await testCase(testDriver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    } finally {
        await testDriver.close();
    }
}

async function runTestWithFirefox(testCase: TestCase<TestWebDriver>): Promise<void> {
    const testDriver = firefoxDriver(testCase);
    try {
        await testCase(testDriver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    } finally {
        await testDriver.close();
    }
}

(async (): Promise<void> => {
    for (const testCase of testCases) {
        // eslint-disable-next-line no-await-in-loop
        await runTestWithChrome(testCase);
    }
})();

(async (): Promise<void> => {
    for (const testCase of testCases) {
        // eslint-disable-next-line no-await-in-loop
        await runTestWithFirefox(testCase);
    }
})();
