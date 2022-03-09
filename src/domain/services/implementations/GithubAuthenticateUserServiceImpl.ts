import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { AuthenticateUserService } from '../AuthenticateUserService';
import { CreateUserIfNotExistService } from '../CreateUserIfNotExistService';
import { FindUserWithAccessTokenService } from '../FindUserWithAccessTokenService';
/**
 * @description Classe que autentica o usuário o github oauth retornando uma token JWT para sessão
 */

interface IAccessTokenResponseData {
  access_token: string;
}

export class GithubAuthenticateUserServiceImpl
  implements AuthenticateUserService
{
  private client_id: string;

  private client_secret: string;

  private createUserIfNotExistService: CreateUserIfNotExistService;

  private findGithubUserWithAccessTokenService: FindUserWithAccessTokenService;

  constructor(
    client_id: string,
    client_secret: string,
    createUserIfNotExistService: CreateUserIfNotExistService,
    findGithubUserWithAccessTokenService: FindUserWithAccessTokenService
  ) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.createUserIfNotExistService = createUserIfNotExistService;
    this.findGithubUserWithAccessTokenService =
      findGithubUserWithAccessTokenService;
  }
  /**
   *
   * @param code
   * @returns a jwt token if the user exists, otherwise the class will throw an exception error
   */

  async authenticate(code: string): Promise<{ token: string }> {
    const { data: githubOauthData } =
      await axios.post<IAccessTokenResponseData>(
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

    const userGithub = await this.findGithubUserWithAccessTokenService.execute(
      githubOauthData.access_token
    );

    const { name, id, avatar_url } =
      await this.createUserIfNotExistService.execute({
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
