import { PrismaClient } from 'prisma/prisma-client';
import { prismaClient } from '../../../prisma';
import { User } from '../../model/User';
import { CreateUserError } from '../../errors/CreateUserError';
import { IUsersResponse } from '../../interfaces/IUsersResponse';
import { CreateUserIfNotExistService } from '../CreateUserIfNotExistService';

export class CreateUserIfNotExistServiceImpl
  implements CreateUserIfNotExistService
{
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = prismaClient;
  }

  async execute(user: IUsersResponse): Promise<User> {
    try {
      const { id, name, login, avatar_url } = user;
      const userExists = await this.prismaClient.user.findFirst({
        where: {
          github_id: id,
        },
      });

      if (!userExists) {
        return await this.prismaClient.user.create({
          data: {
            name,
            login,
            avatar_url,
            github_id: id,
          },
        });
      }
      return userExists;
    } catch (err) {
      throw new CreateUserError('User not found on Github');
    }
  }
}
