/**
 * initialize
 */
(async () => {
    const blockedSites: BlockedSites = await BlockedSitesRepository.load();
    const bannedWords: IBannedWord[] = await BannedWordRepository.load();
    const idnOption = await OptionRepository.getAutoBlockIDNOption();
    const defaultBlockType: string = await OptionRepository.defaultBlockType();
    Logger.debug("autoBlockIDNOption:", idnOption);

    // block
    await BlockTargetFactory.init(blockedSites, bannedWords, idnOption, defaultBlockType);

    // Display body elements hidden by 'document_start'
    document.body.style.display = "block";
})();
