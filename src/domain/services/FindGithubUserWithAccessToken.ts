import { IUsersResponse } from '../interfaces/IUsersResponse';

export interface FindGithubUserWithAccessToken {
  execute(accessToken: string): Promise<IUsersResponse>;
}
