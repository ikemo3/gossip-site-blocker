import chromeDriver from "./chrome";
import firefoxDriver from "./firefox";
import {
    googleSearchResultSoftBlock,
    googleSearchResultHardBlock,
    googleSearchResultCompactMenu,
} from "./test_google_search_result";
import {
    googleSearchInnerCardSoftBlock,
    googleSearchInnerCardHardBlock,
    googleSearchInnerCardCompactMenu,
} from "./test_google_search_inner_card";
import {
    googleSearchTopNewsSoftBlock,
    googleSearchTopNewsHardBlock,
    googleSearchTopNewsCompactMenu,
} from "./test_google_search_top_news";
import {
    googleSearchTweetSoftBlock,
    googleSearchTweetHardBlock,
    // googleSearchTweetCompactMenu,
} from "./test_google_search_tweet";
import {
    googleNewsTabTopSoftBlock,
    googleNewsTabTopHardBlock,
    googleNewsTabTopCompactMenu,
} from "./test_google_news_tab_top";
import { googleImagesTabSoftBlock, googleImagesTabHardBlock, googleImagesTabOff } from "./test_google_images_tab";
import { TestWebDriver } from "./driver";
import { TestCase } from "./libs/interface";

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
    // googleSearchTweetCompactMenu,
    googleNewsTabTopSoftBlock,
    googleNewsTabTopHardBlock,
    googleNewsTabTopCompactMenu,
    googleImagesTabSoftBlock,
    googleImagesTabHardBlock,
    googleImagesTabOff,
];

async function runTestWithChrome(testCase: TestCase<TestWebDriver>): Promise<void> {
    const testDriver = chromeDriver(testCase);
    try {
        // eslint-disable-next-line no-console
        console.log(testCase, testDriver.getDriverType());
        await testCase(testDriver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(testCase, e);
        process.exit(1);
    } finally {
        await testDriver.close();
    }
}

async function runTestWithFirefox(testCase: TestCase<TestWebDriver>): Promise<void> {
    const testDriver = firefoxDriver(testCase);
    try {
        // eslint-disable-next-line no-console
        console.log(testCase, testDriver.getDriverType());
        await testCase(testDriver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(testCase, e);
        process.exit(1);
    } finally {
        await testDriver.close();
    }
}

function getExecTestCase(): string | null {
    if (process.argv.length >= 3) {
        return process.argv[2];
    }

    return null;
}

const execTestCase = getExecTestCase();

(async (): Promise<void> => {
    for (const testCase of testCases) {
        if (execTestCase && testCase.name !== execTestCase) {
            continue;
        }

        // eslint-disable-next-line no-await-in-loop
        await runTestWithChrome(testCase);
    }
})();

(async (): Promise<void> => {
    for (const testCase of testCases) {
        if (execTestCase && testCase.name !== execTestCase) {
            continue;
        }

        // eslint-disable-next-line no-await-in-loop
        await runTestWithFirefox(testCase);
    }
})();
