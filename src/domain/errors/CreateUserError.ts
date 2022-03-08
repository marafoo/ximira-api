export class CreateUserError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'CreateUserError';
    Object.setPrototypeOf(this, CreateUserError.prototype);
  }
}
