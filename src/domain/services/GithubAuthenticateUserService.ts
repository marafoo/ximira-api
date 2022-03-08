import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { prismaClient } from '../../prisma';
import { AccessTokenIncorrectError } from '../errors/AccessTokenIncorrectError';
import { CreateUserError } from '../errors/CreateUserError';
import { AuthenticateUserInterface } from '../interfaces/AuthenticateUserInterface';

interface IAccessTokenResponseData {
  access_token: string;
}

interface IUser {
  avatar_url: string;
  login: string;
  id: string;
  github_id: number;
  name: string;
}

interface IUsersResponseData {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

export class GithubAuthenticateUserService
  implements AuthenticateUserInterface
{
  private client_id: string;

  private client_secret: string;

  private prismaClient: PrismaClient;

  constructor() {
    const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
    this.client_id = GITHUB_CLIENT_ID;
    this.client_secret = GITHUB_CLIENT_SECRET;
    this.prismaClient = prismaClient;
  }

  async authenticate(code: string): Promise<{ token: string }> {
    const { data: accessTokenData } =
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

    const userGithub = await this.userExists(accessTokenData.access_token);

    const { name, id, avatar_url } = await this.createUserIfNotExists({
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

  async createUserIfNotExists(user: IUsersResponseData): Promise<IUser> {
    let userExists: IUser;
    try {
      const { id, name, login, avatar_url } = user;
      userExists = await prismaClient.user.findFirst({
        where: {
          github_id: id,
        },
      });

      if (!userExists) {
        userExists = await this.prismaClient.user.create({
          data: {
            name,
            login,
            avatar_url,
            github_id: id,
          },
        });
      }
    } catch (err) {
      throw new CreateUserError('User not found on Github');
    }
    return userExists;
  }

  async userExists(accessToken: string): Promise<IUsersResponseData> {
    let user: IUsersResponseData | any;
    try {
      user = await axios.get<IUsersResponseData>(
        'https://api.github.com/user',
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      throw new AccessTokenIncorrectError(
        "Could'nt find a user with this access_token"
      );
    }
    return user;
  }
}
