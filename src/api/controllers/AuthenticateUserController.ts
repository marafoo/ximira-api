import { Request, Response } from 'express';
import { AccessTokenIncorrectError } from '../../domain/errors/AccessTokenIncorrectError';
import { CreateUserError } from '../../domain/errors/CreateUserError';
import { GithubAuthenticateUserService } from '../../domain/services/GithubAuthenticateUserService';
import { CustomError } from '../errors/CustomError';

export class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { code } = request.body;

    const serviceGithubAuth = new GithubAuthenticateUserService();

    try {
      if (code === undefined) {
        throw new CustomError('Param code not found', 400);
      }

      const githubAccessToken = await serviceGithubAuth.authenticate(code);

      return response.json(githubAccessToken);
    } catch (error) {
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

      if (error instanceof CustomError) {
        const { message, status } = error;
        return response.status(status).json({
          message,
        });
      }
    }
    return response.send();
  }
}
