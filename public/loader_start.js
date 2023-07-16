(async () => {
  const src = chrome.runtime.getURL("assets/document_start.js");
  await import(src);
})();
