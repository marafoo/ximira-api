import { IUsersResponse } from '../interfaces/IUsersResponse';

export interface FindUserWithAccessTokenService {
  execute(accessToken: string): Promise<IUsersResponse>;
}
