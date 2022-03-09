import { Request, Response } from 'express';
import { AccessTokenIncorrectError } from '../../domain/errors/AccessTokenIncorrectError';
import { CreateUserError } from '../../domain/errors/CreateUserError';
import { GithubAuthenticateUserServiceImpl } from '../../domain/services/implementations/GithubAuthenticateUserServiceImpl';
import { FindGithubUserWithAccessTokenServiceImpl } from '../../domain/services/implementations/FindGithubUserWithAccessTokenServiceImpl';
import { CreateUserIfNotExistServiceImpl } from '../../domain/services/implementations/CreateUserIfNotExistServiceImpl';
import { CustomError } from '../errors/CustomError';

export class AuthenticateUserController {
  public static async handle(request: Request, response: Response) {
    try {
      const { code } = request.body;

      const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

      const githubAuthenticateUserService =
        new GithubAuthenticateUserServiceImpl(
          GITHUB_CLIENT_ID,
          GITHUB_CLIENT_SECRET,
          new CreateUserIfNotExistServiceImpl(),
          new FindGithubUserWithAccessTokenServiceImpl()
        );

      const githubAccessToken =
        await githubAuthenticateUserService.authenticate(code);

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
  }
}
