export const Logger = {
  developerMode: false,

  // oxlint-disable-next-line typescript/no-explicit-any
  debug(message: any, ...params: any[]): void {
    if (this.developerMode) {
      console.log(message, ...params);
    }
  },

  // oxlint-disable-next-line typescript/no-explicit-any
  log(message: any, ...params: any[]): void {
    console.log(message, ...params);
  },

  // oxlint-disable-next-line typescript/no-explicit-any
  error(message: any, ...params: any[]): void {
    console.error(message, ...params);
  },
};
