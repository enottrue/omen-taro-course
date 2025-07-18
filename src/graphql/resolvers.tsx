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
import { emailService } from '@/utils/emailService';
import { getDefaultCourseIdString } from '@/utils/courseUtils';
import { STAGE_STATUSES } from '@/utils/stageStatusUtils';

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
      args: { id?: string; userId: string },
      context: IContext,
      info: {},
    ) => {
      const { id, userId } = args;
      const courseId = id || getDefaultCourseIdString();
      
      console.log('🔍 getCourse resolver called with:', { id, userId, courseId });

      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
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
                    where: userId && Number(userId) !== 0 && Number(userId) !== 1 ? { userId: Number(userId) } : {},
                  },
                },
              },
            },
          },
        },
      });
      
      console.log('🔍 getCourse result:', {
        courseFound: !!course,
        courseId: course?.id,
        courseName: course?.name,
        lessonsCount: course?.lessons?.length || 0,
        lessons: course?.lessons?.map(l => ({ id: l.id, name: l.lessonName, stagesCount: l.lessonStages?.length || 0 }))
      });
      
      if (!course) {
        throw new Error(`No course found for id: ${courseId}`);
      }

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
      
      // Convert Date objects to ISO strings to match Tool interface
      return {
        ...obj,
        createdAt: obj.createdAt.toISOString(),
        updatedAt: obj.updatedAt.toISOString(),
      };
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
      const tool = await prisma.tool.delete({ where: { id: args.id } });
      
      // Convert Date objects to ISO strings to match Tool interface
      return {
        ...tool,
        createdAt: tool.createdAt.toISOString(),
        updatedAt: tool.updatedAt.toISOString(),
      };
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

      const tool = await prisma.tool.update({
        where: { id: args.id },
        data: {
          name: args.name,
          description: args.description,
          link: args.link,
          image: args.image,
        },
      });
      
      // Convert Date objects to ISO strings to match Tool interface
      return {
        ...tool,
        createdAt: tool.createdAt.toISOString(),
        updatedAt: tool.updatedAt.toISOString(),
      };
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
        utmData?: {
          UTM_CAMPAIGN?: string;
          UTM_SOURCE?: string;
          UTM_MEDIUM?: string;
          UTM_CONTENT?: string;
          UTM_TERM?: string;
        };
      },
      context: IContext,
      info: {},
    ) => {
      console.log('🔄 registerUser вызван с аргументами:', args);
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
        // Извлекаем utmData из args, чтобы не передавать его в Prisma
        const { utmData, ...userData } = args;
        
        const user = await context.prisma.user.create({
          data: { ...userData, password },
        });

        // Get all existing stages to create StageStatus records only for them
        const existingStages = await context.prisma.stage.findMany({
          select: { id: true }
        });
        
        console.log(`📊 Creating StageStatus records for ${existingStages.length} existing stages`);
        
        // Check if user already has StageStatus records to avoid duplicates
        const existingStageStatuses = await context.prisma.stageStatus.findMany({
          where: { userId: user.id },
          select: { stageId: true }
        });
        
        if (existingStageStatuses.length === 0) {
          // Create all StageStatus records in one batch operation for better performance
          if (existingStages.length > 0) {
            await context.prisma.stageStatus.createMany({
              data: existingStages.map(stage => ({
                stageId: stage.id,
                userId: user.id,
                status: STAGE_STATUSES.NEW,
              })),
            });
            console.log(`✅ Created ${existingStages.length} StageStatus records for user ${user.id}`);
          }
        } else {
          console.log(`ℹ️ User ${user.id} already has ${existingStageStatuses.length} StageStatus records`);
        }

        //@ts-expect-error
        const token = jwt.sign({ userId: user.id }, APP_SECRET);

        // Создаем сделку в Битрикс24
        console.log('🔄 Вызываем createDealOnRegistration для пользователя:', user.id);
        console.log('📋 Данные для создания сделки:', {
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          city: user.city || undefined,
          productId: '1777',
          comments: `Регистрация пользователя ${user.name} из города ${user.city || 'не указан'}`,
          utmData: utmData,
        });
        try {
          const bitrixResult = await createDealOnRegistration({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            city: user.city || undefined,
            productId: '1777', // Добавляем товар 1777
            comments: `Регистрация пользователя ${user.name} из города ${user.city || 'не указан'}`,
            utmData: utmData || undefined,
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
          console.error('ApolloError в registerUser:', error);
          return {
            message: error.message,
            error: true,
          };
        }
        console.error('Неизвестная ошибка в registerUser:', error);
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
    forgotPassword: async (
      parent: unknown,
      args: { email: string },
      context: IContext,
      info: {}
    ) => {
      try {
        const { email } = args;
        console.log('=== FORGOT PASSWORD RESOLVER START ===');
        console.log('Email received:', email);
        
        // Проверяем, существует ли пользователь с таким email
        const user = await context.prisma.user.findUnique({
          where: { email },
        });

        console.log('User found:', !!user);
        if (user) {
          console.log('User ID:', user.id);
          console.log('User name:', user.name);
        }

        if (!user) {
          console.log('No user found, returning success message');
          return {
            message: 'Если пользователь с таким email существует, инструкции отправлены',
            error: false,
          };
        }

        // Проверяем наличие APP_SECRET
        if (!APP_SECRET) {
          console.error('APP_SECRET not configured');
          throw new Error('APP_SECRET не настроен');
        }

        console.log('APP_SECRET is configured');

        // Генерируем токен для сброса пароля
        const resetToken = jwt.sign(
          { userId: user.id, type: 'password-reset' },
          APP_SECRET,
          { expiresIn: '1h' }
        );

        console.log('Reset token generated');

        // Создаем URL для сброса пароля
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
        console.log('Reset URL created:', resetUrl);

        console.log('Calling email service...');
        // Отправляем email с ссылкой для сброса пароля
        const emailResult = await emailService.sendPasswordResetEmail(
          user.email,
          resetUrl,
          user.name || 'Пользователь'
        );

        console.log('Email service result:', emailResult);

        if (emailResult.success) {
          console.log('Password reset email sent successfully');
          return {
            message: 'Инструкции для восстановления пароля отправлены на ваш email',
            error: false,
            resetUrl: resetUrl, // Добавляем URL для отладки
          };
        } else {
          console.error('Failed to send password reset email:', emailResult.error);
          return {
            message: 'Ошибка при отправке email. Попробуйте позже.',
            error: true,
          };
        }
      } catch (error) {
        console.error('Error in forgotPassword:', error);
        return {
          message: 'Произошла ошибка. Попробуйте позже.',
          error: true,
        };
      } finally {
        console.log('=== FORGOT PASSWORD RESOLVER END ===');
      }
    },
    resetPassword: async (
      parent: unknown,
      args: {
        token: string;
        newPassword: string;
      },
      context: IContext,
      info: {},
    ) => {
      const { token, newPassword } = args;

      try {
        // Проверяем токен
        if (!APP_SECRET) {
          throw new Error('APP_SECRET не настроен');
        }
        const decoded = jwt.verify(token, APP_SECRET) as any;
        
        if (decoded.type !== 'password-reset') {
          throw new Error('Недействительный токен');
        }

        const userId = decoded.userId;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Обновляем пароль пользователя
        const updatedUser = await context.prisma.user.update({
          where: { id: userId },
          data: { password: hashedPassword },
        });

        // Генерируем новый токен авторизации
        const authToken = jwt.sign({ userId: updatedUser.id }, APP_SECRET);

        return {
          message: 'Пароль успешно изменен',
          error: false,
          user: updatedUser,
          token: authToken,
        };
      } catch (error) {
        return {
          message: 'Недействительный или истекший токен',
          error: true,
        };
      }
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
          status: STAGE_STATUSES.NEW,
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
