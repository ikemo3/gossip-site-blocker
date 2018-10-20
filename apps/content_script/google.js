/**
 * initialize
 */
(async () => {
    const blockedSites = await BlockedSitesRepository.load();
    const bannedWords = await BannedWordRepository.load();
    const idnOption = await OptionRepository.getAutoBlockIDNOption();
    const defaultBlockType = await OptionRepository.defaultBlockType();
    Logger.debug("autoBlockIDNOption:", idnOption);
    // block
    await BlockTargetFactory.init(blockedSites, bannedWords, idnOption, defaultBlockType);
    // Display body elements hidden by 'document_start'
    document.body.style.display = "block";
})();
//# sourceMappingURL=google.js.map