import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/header/Header';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import OnboardingStages from '@/components/onboarding/OnboardingStages';

import { useGetLazyUserData } from '@/hooks/useGetUserData';
import CourseHero from '@/components/course_hero/Course_hero';
import CourseLessons from '@/components/course_lessons/courseLessons';
import Footer from '@/components/footer/Footer';

import { apolloClient } from '@/lib/apollo/apollo';
import { GET_LESSON, GET_LESSONS } from '@/graphql/queries';
import CourseLessonHeader from '@/components/lesson_header/lessonHeader';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const APP_SECRET = process.env.APP_SECRET;
  const cookies = context.req.headers.cookie
    ? cookie.parse(context.req.headers.cookie)
    : {};

  if (!context.query.lessonId || !context.query.stageId) {
    return {
      redirect: {
        destination: '/courses',
        permanent: false,
      },
    };
  }

  try {
    //@ts-expect-error
    jwt.verify(cookies.Bearer, APP_SECRET);
    var userId = cookies?.userId ? cookies.userId : null;
    var token = cookies?.Bearer ? cookies.Bearer : null;
  } catch (error) {
    userId = null;
    token = null;
  }

  try {
    const lesson = await apolloClient.query({
      query: GET_LESSON,
      variables: {
        id: Number(context.query.lessonId),
      },
    });
    const { lessonId: currentLessonId, stageId: currentStageId } =
      context.query;
    console.log(
      'currentLessonId',
      currentLessonId,
      'currentStageId',
      currentStageId,
      lesson.data.getLesson,
    );
    const stageExists = lesson?.data?.getLesson?.lessonStages.some(
      (stage: any) => Number(stage.stageNumber) === Number(currentStageId),
    );

    if (!lesson.data.getLesson || !stageExists) {
      return {
        redirect: {
          destination: '/courses',
          permanent: false,
        },
      };
    }

    return {
      props: {
        userId,
        token,
        lesson: lesson.data.getLesson,
        currentLessonId,
        currentStageId,
      },
    };
  } catch (error) {
    console.log('error', error);
    return {
      redirect: {
        destination: '/courses',
        permanent: false,
      },
    };
  }

  const { lessonId, stageId } = context.query;

  return {
    props: {
      userId,
      token,
    },
  };
};

const Lesson = ({
  userId,
  token,
  lesson,
  currentStageId,
  currentLessonId,
}: {
  userId: string | null;
  token: string | null;
  currentStageId: string | undefined;
  currentLessonId: string | undefined;
  lesson:
    | {
        [k: string]: any;
      }
    | undefined;
}) => {
  const router = useRouter();

  const {
    getUser,
    loading: loadingLazy,
    error: errorLazy,
    user,
  } = useGetLazyUserData(Number(userId));

  const cc = useContext(MainContext);

  useEffect(() => {
    cc?.setUserId(userId);
    cc?.setToken(token);
    const us = getUser({ variables: { userId } });
    // console.log('user', user, us, loadingLazy, errorLazy);

    if (!userId || !token) {
      router.push('/');
    }
  }, [userId, token]);

  useEffect(() => {
    if (user) {
      // Handle the case when the user data is not found
      cc?.setUser(user);
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Обучающий курс по Таро</title>
        <meta name="Обучающий курс по Таро - Omen | Курс Таро" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header token={token} userId={userId} />
        <CourseLessonHeader
          lesson={lesson}
          currentStageId={currentStageId}
          currentLessonId={currentLessonId}
        />
      </main>
      <Footer />
    </>
  );
};

export default Lesson;
