export interface AuthenticateUserInterface {
  authenticate(code: string): Promise<{ token: string }>;
}
