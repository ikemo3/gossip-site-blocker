import chromeDriver from './chrome';
import firefoxDriver from './firefox';
import googleSearchResult from './test_google_search_result';
import googleSearchInnerCard from './test_google_search_inner_card';
import googleSearchTopNews from './test_google_search_top_news';
import googleSearchTweet from './test_google_search_tweet';
import googleNewsTabTop from './test_google_news_tab_top';
import googleImagesTab from './test_google_images_tab';

(async (): Promise<void> => {
    const testDriver = chromeDriver();
    try {
        await googleSearchResult(testDriver);
        await googleSearchInnerCard(testDriver);
        await googleSearchTopNews(testDriver);
        await googleSearchTweet(testDriver);
        await googleNewsTabTop(testDriver);
        await googleImagesTab(testDriver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    } finally {
        await testDriver.close();
    }
})();

(async (): Promise<void> => {
    const testDriver = firefoxDriver();
    try {
        await googleSearchResult(testDriver);
        await googleSearchInnerCard(testDriver);
        await googleSearchTopNews(testDriver);
        await googleSearchTweet(testDriver);
        await googleNewsTabTop(testDriver);
        await googleImagesTab(testDriver);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exitCode = 1;
    } finally {
        await testDriver.close();
    }
})();
