import { Request, Response } from 'express';
import { AccessTokenIncorrectError } from '../../domain/errors/AccessTokenIncorrectError';
import { CreateUserError } from '../../domain/errors/CreateUserError';
import { GithubAuthenticateUserService } from '../../domain/services/GithubAuthenticateUserService';

export class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { code } = request.body;
    const service = new GithubAuthenticateUserService();
    try {
      const accessToken = await service.authenticate(code);
      return response.json(accessToken);
    } catch (error: { message: string; status: number }) {
      if (error instanceof AccessTokenIncorrectError) {
        const { message } = error;
        return response.status(404).json({
          message,
        });
      }
      if (error instanceof CreateUserError) {
        const { message } = error;
        return response.status(500).json({
          message,
        });
      }
    }
  }
}
