export class AccessTokenIncorrectError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'AccessTokenIncorrectError';
    Object.setPrototypeOf(this, AccessTokenIncorrectError.prototype);
  }
}
