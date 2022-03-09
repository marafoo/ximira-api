export interface AuthenticateUserService {
  authenticate(code: string): Promise<{ token: string }>;
}
