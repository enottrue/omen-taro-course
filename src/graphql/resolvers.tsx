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
import { createDealOnRegistration, getUtmDataFromCookies } from '../utils/bitrix24';

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
              lessonStages: {
                include: {
                  stageStatuses: true,
                },
              },
            },
          },
        },
      });
      // console.log(678, '***********', courses);
      // return courses;
    },
    getCourse: async (
      parent: unknown,
      args: { id: string; userId: string },
      context: IContext,
      info: {},
    ) => {
      const { id, userId } = args;

      const course = await prisma.course.findUnique({
        where: { id: Number(id) },
        include: {
          lessons: {
            orderBy: {
              id: 'asc',
            },
            include: {
              lessonStages: {
                orderBy: {
                  id: 'asc',
                },
                include: {
                  stageStatuses: {
                    orderBy: {
                      id: 'asc',
                    },
                    where: { userId: Number(userId) },
                  },
                },
              },
            },
          },
        },
      });
      if (!course) {
        throw new Error(`No course found for id: ${id}`);
      }

      // Filter stageStatuses based on userId
      // course.lessons.forEach((lesson) => {
      //   lesson.lessonStages.forEach((stage) => {
      //     stage.stageStatuses = stage.stageStatuses.filter((status) => {
      //       console.log('000', status.userId, userId);
      //       return status.userId == Number(userId);
      //     });
      //   });
      // });
      // console.log(678, '***********', course.lessons.lessonStages[0]);

      return course;
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
            orderBy: {
              id: 'asc',
            },
            include: {
              stageTimecodes: true,
              stageStatuses: true,
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
            orderBy: {
              id: 'asc',
            },
            include: {
              stageTimecodes: true,
              stageStatuses: true,
            },
          },
        },
      });

      return lessons;
    },
    getStageStatus: async (
      parent: unknown,
      args: { userId: string | number },
      context: IContext,
      info: {},
    ) => {
      const { userId: id } = args;
      if (id === undefined || isNaN(Number(id))) {
        throw new Error('Invalid user ID');
      }

      return await prisma.stageStatus.findMany({
        where: { userId: Number(id) },
        orderBy: {
          id: 'asc',
        },
        include: {
          user: true,
          stage: true,
        },
      });
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

        for (let stageId = 1; stageId <= 44; stageId++) {
          await context.prisma.stageStatus.create({
            data: {
              stageId,
              userId: user.id,
              status: 'new',
            },
          });
        }

        //@ts-expect-error
        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        // Создаем сделку в Битрикс24
        try {
          const utmData = getUtmDataFromCookies();
          const bitrixResult = await createDealOnRegistration({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            city: user.city || undefined,
            productId: '1777', // Добавляем товар 1777
            utmData,
            comments: `Регистрация пользователя ${user.name} из города ${user.city || 'не указан'}`,
          });

          if (bitrixResult.success) {
            console.log('Сделка успешно создана в Битрикс24:', bitrixResult.dealId);
            
            // Обновляем пользователя с ID из Битрикс24
            await context.prisma.user.update({
              where: { id: user.id },
              data: {
                bitrix24ContactId: bitrixResult.contactId,
                bitrix24DealId: bitrixResult.dealId,
              },
            });
          } else {
            console.error('Ошибка создания сделки в Битрикс24:', bitrixResult.error);
          }
        } catch (bitrixError) {
          console.error('Ошибка интеграции с Битрикс24:', bitrixError);
          // Не прерываем регистрацию пользователя, если Битрикс24 недоступен
        }

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
    addStageStatus: async (
      parent: unknown,
      args: {
        stageId: Number;
        userId: Number;
        status: string;
      },
      context: IContext,
      info: {},
    ) => {
      // const { userId } = context;
      const { stageId, status, userId } = args;

      const existingStageStatus = await context.prisma.stageStatus.findFirst({
        where: {
          userId: Number(userId),
          stageId: Number(stageId),
        },
      });

      if (existingStageStatus) {
        throw new Error('StageStatus already exists for this user and stage');
      }

      const stageStatus = await context.prisma.stageStatus.create({
        data: {
          stageId: Number(stageId),
          userId: Number(userId),
          status: 'new',
        },
      });

      return stageStatus;

      // const user = await context.prisma.user.findUnique({
      //   where: { email: args.email },
      // });
      // if (!user) {
      //   throw new Error('Неправильный пароль или email');
      // }
      // const valid = await bcrypt.compare(args.password, user.password);
      // if (!valid) {
      //   throw new Error('Неправильный пароль или email');
      // }
      // //@ts-expect-error
      // const token = jwt.sign({ userId: user.id }, APP_SECRET);
      // return {
      //   token,
      //   user,
      // };
    },
    changeStageStatus: async (
      parent: unknown,
      args: {
        stageId: number;
        userId: number;
        status: string;
      },
      context: IContext,
      info: {},
    ) => {
      const { stageId, status, userId } = args;
      // const stageStatus = await prisma.stageStatus.findFirst({
      //   where: {
      //     stageId: Number(stageId),
      //     userId: Number(userId),
      //   },
      // });

      // const updatedStageStatus = await prisma.stageStatus.upsert({
      //   where: { id: stageStatus?.id },
      //   create: {
      //     status,
      //     stage: { connect: { id: stageId } },
      //     user: { connect: { id: userId } },
      //   },
      //   update: { status },
      //   include: {
      //     stage: {
      //       include: {
      //         stageStatuses: true,
      //       },
      //     },
      //   },
      // });

      const stageStatus = await prisma.stageStatus.findFirst({
        where: {
          stageId: Number(stageId),
          userId: Number(userId),
        },
      });
      console.log(stageStatus, '000');

      if (stageStatus) {
        // Update the existing record
        const updatedStageStatus = await prisma.stageStatus.update({
          where: { id: stageStatus.id },
          data: { status },
          include: {
            stage: true,
            user: true,
          },
        });
        return updatedStageStatus;
      } else {
        // Create a new record
        const newStageStatus = await prisma.stageStatus.create({
          data: {
            status,
            stage: { connect: { id: stageId } },
            user: { connect: { id: userId } },
          },
          include: {
            stage: true,
            user: true,
          },
        });
        return newStageStatus;
      }

      // if (!stageStatus) {
      //   // throw new Error('StageStatus not found');
      //   const updatedStageStatus = await prisma.stageStatus.create({
      //     data: {
      //       stageId: Number(stageId),
      //       userId: Number(userId),
      //       status,
      //     },
      //   });
      //   return updatedStageStatus;
      // } else {
      //   const updatedStageStatus = await prisma.stageStatus.update({
      //     where: { id: stageStatus?.id },
      //     data: { status },
      //     include: {
      //       stage: {
      //         include: {
      //           stageStatuses: true,
      //         },
      //       },
      //     },
      //   });
      //   return updatedStageStatus;
      // }
    },
  },
};

export default resolvers;
