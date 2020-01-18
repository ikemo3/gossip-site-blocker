import create_appbar_links from '../content_script/appbar';

(async (): Promise<void> => {
    await create_appbar_links();
})();
