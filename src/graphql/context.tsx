import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma/prismaClient';
import { IContext } from './types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserId } from '@/utils/authUtils';

export const contextCreator = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<{ prisma: PrismaClient }> => {
  return {
    ...req,
    prisma,
    //@ts-expect-error
    userId: req && req.headers.authorization ? getUserId(req) : null,
  };
};

export default contextCreator;
