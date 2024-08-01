export const Logger = {
  developerMode: false,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: any, ...params: any[]): void {
    if (this.developerMode) {
      console.log(message, ...params);
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: any, ...params: any[]): void {
    console.log(message, ...params);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: any, ...params: any[]): void {
    console.error(message, ...params);
  },
};
