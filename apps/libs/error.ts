export class ApplicationError implements Error {
  public message: string;

  public name = "Application Error";

  constructor(message: string) {
    this.message = message;
  }

  public toString(): string {
    return `${this.name}: ${this.message}`;
  }
}
