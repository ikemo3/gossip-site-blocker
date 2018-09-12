/**
 * initialize
 */
(async () => {
    // block
    await BlockTargetFactory.init();

    // Display body elements hidden by 'document_start'
    document.body.style.display = "block";
})();
