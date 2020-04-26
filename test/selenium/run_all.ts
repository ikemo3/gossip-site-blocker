import chromeDriver from './chrome';
import firefoxDriver from './firefox';
import { googleSearchResult, googleSearchResultCompactMenu } from './test_google_search_result';
import googleSearchInnerCard from './test_google_search_inner_card';
import googleSearchTopNews from './test_google_search_top_news';
import googleSearchTweet from './test_google_search_tweet';
import googleNewsTabTop from './test_google_news_tab_top';
import googleImagesTab from './test_google_images_tab';
import { TestWebDriver } from './driver';

const testCases = [
    googleSearchResult,
    googleSearchResultCompactMenu,
    googleSearchInnerCard,
    googleSearchTopNews,
    googleSearchTweet,
    googleNewsTabTop,
    googleImagesTab,
];

type TestCase = (driver: TestWebDriver) => Promise<void>;

async function runTestWithChrome(testCase: TestCase): Promise<void> {
    const testDriver = chromeDriver();
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

async function runTestWithFirefox(testCase: TestCase): Promise<void> {
    const testDriver = firefoxDriver();
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
