(async () => {
  const src = chrome.runtime.getURL("assets/document_idle.js");
  await import(src);
})();
