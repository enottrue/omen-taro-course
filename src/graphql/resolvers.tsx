import { Tool } from '@/lib/dump-data/types';
import { prisma } from '@/lib/prisma/prismaClient';
import tools from '../lib/dump-data/toolsData';
import { IContext } from './types';
import { User } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { GraphQLError } from 'graphql';

import { getUserId } from '@/utils/authUtils';
import { ApolloError } from '@apollo/client';

dotenv.config();

const APP_SECRET = process.env.APP_SECRET;
export const resolvers = {
  Query: {
    getId: (parent: unknown, args: {}, context: IContext, info: {}) => {
      const { userId } = context;
      return context.id;
    },
    getTools: async (
      parent: unknown,
      args: {},
      context: IContext,
      info: {},
    ) => {
      const { userId } = context;

      const tools = await context.prisma.tool.findMany({});
      return tools;
    },
    getTool: async (
      parent: unknown,
      args: { id: string | number },
      context: IContext,
      info: {},
    ) => {
      const { userId } = context;

      if (typeof args.id === 'string') {
        args.id = Number(args.id);
      }
      const tools = await prisma.tool.findUnique({
        where: { id: args.id },
      });
      return tools;
    },
    getUser: async (
      parent: unknown,
      args: { id: string | number },
      context: IContext,
      info: {},
    ) => {
      const { userId } = context;

      if (typeof args.id === 'string') {
        args.id = Number(args.id);
      }
      const user = await prisma.user.findUnique({
        where: { id: args.id },
      });
      return user;
    },
    getUsers: async (
      parent: unknown,
      args: {},
      context: IContext,
      info: {},
    ) => {
      const { userId } = context;

      const users = await prisma.user.findMany({});
      return users;
    },
    getCourses: async (
      parent: unknown,
      args: {},
      context: IContext,
      info: {},
    ) => {
      const { userId } = context;

      return await prisma.course.findMany({
        include: {
          lessons: {
            include: {
              lessonStages: true,
            },
          },
        },
      });
      // console.log(678, '***********', courses);
      // return courses;
    },
    getCourse: async (
      parent: unknown,
      args: { id: string },
      context: IContext,
      info: {},
    ) => {
      const { id } = args;

      return await prisma.course.findUnique({
        where: { id: Number(id) },
        include: {
          lessons: {
            include: {
              lessonStages: true,
            },
          },
        },
      });
    },
    getLesson: async (
      parent: unknown,
      args: { id: string },
      context: IContext,
      info: {},
    ) => {
      const { id } = args;

      return await prisma.lesson.findUnique({
        where: { id: Number(id) },
        include: {
          lessonStages: {
            include: {
              stageTimecodes: true,
            },
          },
        },
      });
    },
    getLessons: async (
      parent: unknown,
      args: { id: string },
      context: IContext,
      info: {},
    ) => {
      const lessons = await prisma.lesson.findMany({
        include: {
          lessonStages: {
            include: {
              stageTimecodes: true,
            },
          },
        },
      });

      return lessons;
    },
  },

  Mutation: {
    addTool: async (
      parent: unknown,
      args: { name: string; link: string; description: string; image: string },
      context: IContext,
      info: {},
    ): Promise<Tool> => {
      const { userId } = context;

      const tools = await prisma.tool.findMany({});
      const newTool = {
        id: tools.length + 1,
        name: args.name,
        description: args.description,
        link: args.link,
        image: args.image,
      };
      const obj = await prisma.tool.create({ data: newTool });
      return obj;
    },
    deleteTool: async (
      parent: unknown,
      args: { id: string | number },
      context: IContext,
      info: {},
    ) => {
      if (typeof args.id === 'string') {
        args.id = Number(args.id);
      }
      let tool: Tool | null | { message: string };
      tool = await prisma.tool.delete({ where: { id: args.id } });
      return tool;
    },
    updateTool: async (
      parent: unknown,
      args: {
        id: string | number;
        name: string;
        link: string;
        description: string;
        image: string;
      },
      context: IContext,
      info: {},
    ) => {
      if (typeof args.id === 'string') {
        args.id = Number(args.id);
      }

      let tool: Tool;
      tool = await prisma.tool.update({
        where: { id: args.id },
        data: {
          name: args.name,
          description: args.description,
          link: args.link,
          image: args.image,
        },
      });
      return tool;
    },
    addUser: async (
      parent: unknown,
      args: {
        name: string;
        email: string;
        city: string;
        phone: string;
        password: string;
      },
      context: IContext,
      info: {},
    ) => {
      const { userId } = context;

      const newUser = {
        name: args.name,
        email: args?.email,
        city: args?.city,
        phone: args?.phone,
        password: args.password,
      };
      const createdUser = await prisma.user.create({
        data: { ...newUser },
      });
      return createdUser;
    },
    updateUser: async (
      parent: unknown,
      args: {
        id: string | number;
        name: string;
        email: string;
        phone: string;
        city: string;
        password: string;
        onboarded: boolean;
      },
      context: IContext,
      info: {},
    ) => {
      const { userId } = context;

      if (typeof args.id === 'string') {
        args.id = Number(args.id);
      }

      let user: User;
      user = await prisma.user.update({
        where: { id: args.id },
        data: {
          name: args.name,
          email: args.email,
          phone: args.phone,
          city: args.city,
          password: args.password,
          onboarded: args.onboarded,
        },
      });
      return user;
    },
    registerUser: async (
      parent: unknown,
      args: {
        name: string;
        email: string;
        phone?: string;
        password: string;
        city?: string;
      },
      context: IContext,
      info: {},
    ) => {
      const { userId } = context;

      const password = await bcrypt.hash(args.password, 10);

      try {
        const userPresence = await context.prisma.user.findUnique({
          where: { email: args.email },
        });
        if (userPresence?.id) {
          // throw new Error('Пользователь уже зарегистрирован');
          return {
            message: 'Пользователь уже зарегистрирован',
            error: true,
          };
        }
        const user = await context.prisma.user.create({
          data: { ...args, password },
        });
        //@ts-expect-error
        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        return {
          token,
          user,
          message: null,
          error: false,
        };
      } catch (error: unknown) {
        if (error instanceof ApolloError) {
          return {
            message: error.message,
            error: true,
          };
        }
        console.log('Что-то не так');
        return {
          message: 'Что-то пошло не так. Попробуй еще раз',
          error: true,
        };
      }
    },
    loginUser: async (
      parent: unknown,
      args: {
        email: string;
        password: string;
      },
      context: IContext,
      info: {},
    ) => {
      const { userId } = context;

      const user = await context.prisma.user.findUnique({
        where: { email: args.email },
      });
      if (!user) {
        throw new Error('Неправильный пароль или email');
      }
      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new Error('Неправильный пароль или email');
      }
      //@ts-expect-error
      const token = jwt.sign({ userId: user.id }, APP_SECRET);
      return {
        token,
        user,
      };
    },
  },
};

export default resolvers;
