/**
 * 初期化
 */
(async function () {
    // ブロック処理
    await BlockTargetFactory.init();

    // document_startで非表示にした、body要素の表示
    document.body.style.display = "block";
})();
