import { ApolloServer } from '@apollo/server';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma/prismaClient';

import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';

import { IContext } from '@/graphql/types';
import contextCreator from '@/graphql/context';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: contextCreator,
});

export { handler as GET, handler as POST };
export default handler;
