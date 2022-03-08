export class CustomError extends Error {
  constructor(public message: string, public status = 500) {
    super(message);
    this.name = 'CustomError';
    this.status = status;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
