import axios from 'axios';
import { IUsersResponse } from '../interfaces/IUsersResponse';
import { AccessTokenIncorrectError } from '../errors/AccessTokenIncorrectError';

export class FindGithubUserWithAccessToken {
  async execute(accessToken: string): Promise<IUsersResponse> {
    try {
      return await axios.get<IUsersResponse, IUsersResponse>(
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
  }
}
