import { User } from '../model/User';
import { IUsersResponse } from '../interfaces/IUsersResponse';

export interface CreateUserIfNotExist {
  execute(user: IUsersResponse): Promise<User>;
}
