export const ChromeStorage = {
  async load<T>(keys: T): Promise<T> {
    return new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      chrome.storage.local.get(keys, resolve);
    });
  },

  // eslint-disable-next-line @typescript-eslint/ban-types
  async save(items: object): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, resolve);
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get(keys: any): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, resolve);
    });
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async set(items: any): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, resolve);
    });
  },
};
