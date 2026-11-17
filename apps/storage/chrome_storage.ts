export const ChromeStorage = {
  async load<T>(keys: T): Promise<T> {
    return new Promise((resolve) => {
      // oxlint-disable-next-line typescript/ban-ts-comment
      // @ts-ignore
      chrome.storage.local.get(keys, resolve);
    });
  },

  async save(items: object): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, resolve);
    });
  },

  // oxlint-disable-next-line typescript/no-explicit-any
  async get(keys: any): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, resolve);
    });
  },

  // oxlint-disable-next-line typescript/no-explicit-any
  async set(items: any): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, resolve);
    });
  },
};
