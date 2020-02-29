import createAppbarLinks from '../content_script/appbar';
import { OptionRepository } from '../repository/config';

(async (): Promise<void> => {
    const display = await OptionRepository.isDisplayTemporarilyUnblockAll();
    if (display) {
        await createAppbarLinks();
    }
})();
