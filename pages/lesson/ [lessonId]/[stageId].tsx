import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import OnboardingStages from '@/components/onboarding/OnboardingStages';
import PaymentRequired from '@/components/PaymentRequired';

import { useGetLazyUserData } from '@/hooks/useGetUserData';
import CourseHero from '@/components/course_hero/Course_hero';
import CourseLessons from '@/components/course_lessons/courseLessons';
import Footer from '@/components/footer/Footer';

import { apolloClient } from '@/lib/apollo/apollo';
import { GET_LESSON, GET_LESSONS } from '@/graphql/queries';
import CourseLessonHeader from '@/components/lesson_header/lessonHeader';
import FooterInside from '@/components/footerInside/Footer';

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

  let userId = null;
  let token = null;
  let userData = null;

  try {
    //@ts-expect-error
    jwt.verify(cookies.Bearer, APP_SECRET);
    userId = cookies?.userId ? cookies.userId : null;
    token = cookies?.Bearer ? cookies.Bearer : null;

    // Получаем данные пользователя для проверки статуса оплаты
    if (userId) {
      try {
        const response = await fetch(`${context.req.headers.host ? `http://${context.req.headers.host}` : 'http://localhost:3000'}/api/users/${userId}`);
        if (response.ok) {
          userData = await response.json();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
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
      'Full lesson data:',
      lesson.data.getLesson,
    );
    
    // Log specific stage data
    const currentStage = lesson.data.getLesson?.lessonStages?.find(
      (stage: any) => Number(stage.stageNumber) === Number(currentStageId)
    );
    console.log('Current stage data:', currentStage);
    console.log('Current stage description:', currentStage?.stageDescription);
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
        userData: userData?.user || null,
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
      userData: userData?.user || null,
    },
  };
};

const Lesson = ({
  userId,
  token,
  userData,
  lesson,
  currentStageId,
  currentLessonId,
}: {
  userId: string | null;
  token: string | null;
  userData: any;
  currentStageId: string | undefined;
  currentLessonId: string | undefined;
  lesson:
    | {
        [k: string]: any;
      }
    | undefined;
}) => {
  const router = useRouter();
  const [showPaymentRequired, setShowPaymentRequired] = useState(false);

  const {
    fetchUser,
    loading: loadingLazy,
    error: errorLazy,
    user,
  } = useGetLazyUserData();

  const cc = useContext(MainContext);
 

  useEffect(() => {
    cc?.setUserId(userId);
    cc?.setToken(token);
    
    if (userId) {
      fetchUser(Number(userId));
    }
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

  // Global protection against video downloading
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Prevent common keyboard shortcuts for saving/downloading
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 's' || e.key === 'S' || e.key === 'c' || e.key === 'C')
      ) {
        e.preventDefault();
        return false;
      }
      
      // Prevent F12, Ctrl+Shift+I, Ctrl+U (developer tools)
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleGlobalContextMenu = (e: MouseEvent) => {
      // Allow context menu only for specific elements
      const target = e.target as HTMLElement;
      if (target.closest('.cource-lesson-header__media')) {
        e.preventDefault();
        return false;
      }
    };

    const handleGlobalDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.cource-lesson-header__media')) {
        e.preventDefault();
        return false;
      }
    };

    // Add global event listeners
    document.addEventListener('keydown', handleGlobalKeyDown);
    document.addEventListener('contextmenu', handleGlobalContextMenu);
    document.addEventListener('dragstart', handleGlobalDragStart);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
      document.removeEventListener('dragstart', handleGlobalDragStart);
    };
  }, []);

  // Проверяем статус оплаты
  useEffect(() => {
    if (userData && !userData.isPaid) {
      setShowPaymentRequired(true);
    } else {
      setShowPaymentRequired(false);
    }
  }, [userData]);

  // Если пользователь не оплатил, показываем компонент PaymentRequired
  if (showPaymentRequired) {
    return (
      <>
        <Head>
          <title>Доступ ограничен - Урок</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
        </Head>
        <main>
          <PaymentRequired />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Обучающий курс по Таро</title>
        <meta name="Обучающий курс по Таро - Omen | Курс Таро" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="shortcut icon" href="/favicon/favicon.ico" />
 
      </Head>
      <main>
      <CourseLessonHeader
        lesson={lesson}
        currentStageId={currentStageId}
        currentLessonId={currentLessonId}
      />
      <FooterInside />
      </main>
    </>
  );
};

export default Lesson;
