import chromeDriver from './chrome';
import firefoxDriver from './firefox';
import googleSearchResult from './test_google_search_result';
import googleSearchInnerCard from './test_google_search_inner_card';
import googleSearchTopNews from './test_google_search_top_news';

(async (): Promise<void> => {
    const driver = chromeDriver();
    try {
        await googleSearchResult(driver);
        await googleSearchInnerCard(driver);
        await googleSearchTopNews(driver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    } finally {
        await driver.close();
    }
})();

(async (): Promise<void> => {
    const driver = firefoxDriver();
    try {
        await googleSearchResult(driver);
        await googleSearchInnerCard(driver);
        await googleSearchTopNews(driver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    } finally {
        await driver.close();
    }
})();
