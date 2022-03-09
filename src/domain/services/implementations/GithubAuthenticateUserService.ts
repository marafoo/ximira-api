import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { AuthenticateUserInterface } from '../interfaces/AuthenticateUserInterface';
import { CreateUserIfNotExist } from './CreateUserIfNotExist';
import { FindGithubUserWithAccessToken } from './FindGithubUserWithAccessToken';
/**
 * @description Classe que autentica o usuário o github oauth retornando uma token JWT para sessão
 */

interface IAccessTokenResponseData {
  access_token: string;
}

export class GithubAuthenticateUserService
  implements AuthenticateUserInterface
{
  private client_id: string;

  private client_secret: string;

  private createUserIfNotExist: CreateUserIfNotExist;

  private findGithubUserWithAccessToken: FindGithubUserWithAccessToken;

  constructor() {
    const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
    this.client_id = GITHUB_CLIENT_ID;
    this.client_secret = GITHUB_CLIENT_SECRET;
    this.createUserIfNotExists = new CreateUserIfNotExists();
    this.findGithubUserWithAccessToken = new FindGithubUserWithAccessToken();
  }
  /**
   *
   * @param code
   * @returns a jwt token if the user exists, otherwise the class will throw an exception error
   */

  async authenticate(code: string): Promise<{ token: string }> {
    const { data } = await axios.post<IAccessTokenResponseData>(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: this.client_id,
          client_secret: this.client_secret,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const userGithub = await this.findGithubUserWithAccessToken.execute(
      data.access_token
    );

    const { name, id, avatar_url } = await this.createUserIfNotExist.execute({
      name: userGithub.name,
      login: userGithub.login,
      id: userGithub.id,
      avatar_url: userGithub.avatar_url,
    });

    const token = sign(
      {
        user: {
          name,
          id,
          avatar_url,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: name,
        expiresIn: '1d',
      }
    );

    return {
      token,
    };
  }
}
