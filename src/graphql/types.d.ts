import { PrismaClient, User } from '@prisma/client';

export declare interface IContext {
  test?: string;
  userId?: string | number;
  id?: number;
  prisma: PrismaClient;
}

declare type ITool = {
  name?: string;
  url?: string;
};

declare type IUser = User;
