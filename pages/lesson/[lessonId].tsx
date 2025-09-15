import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/header/Header';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import OnboardingStages from '@/components/onboarding/OnboardingStages';
import PaymentRequired from '@/components/PaymentRequired';
import { useMetrica } from 'next-yandex-metrica';

import { useGetLazyUserData } from '@/hooks/useGetUserData';
import CourseHero from '@/components/course_hero/Course_hero';
import CourseLessons from '@/components/course_lessons/courseLessons';
import Footer from '@/components/footer/Footer';

import { apolloClient } from '@/lib/apollo/apollo';
import { GET_LESSON, GET_LESSONS } from '@/graphql/queries';
import FooterInside from '@/components/footerInside/Footer';
import { getEnvironment } from '@/utils/environment';
import { EnvironmentInfo } from '@/components/EnvironmentInfo';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const APP_SECRET = process.env.APP_SECRET;
  const cookies = context.req.headers.cookie
    ? cookie.parse(context.req.headers.cookie)
    : {};

  if (!context.query.lessonId) {
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
    const lessons = await apolloClient.query({
      query: GET_LESSONS,
    });
    return {
      props: {
        userId,
        token,
        userData: userData?.user || null,
        lessons: lessons.data.getLessons,
      },
    };
  } catch (error) {
    console.log('error', error);
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
  lessons,
}: {
  userId: string | null;
  token: string | null;
  userData: any;
  lessons:
    | {
        [k: string]: any;
      }
    | undefined;
}) => {
  const router = useRouter();
  const [showPaymentRequired, setShowPaymentRequired] = useState(false);
  const { reachGoal } = useMetrica();

  const {
    fetchUser,
    loading: loadingLazy,
    error: errorLazy,
    user,
  } = useGetLazyUserData();

  const cc = useContext(MainContext);
 
  useEffect(() => {
    // Send Yandex Metrica event for lesson page view
    reachGoal('lesson_page_viewed');
  }, [reachGoal]);

  useEffect(() => {
    cc?.setUserId(userId);
    cc?.setToken(token);
    
    if (userId) {
      fetchUser(Number(userId));
    }
 

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

  // Проверяем статус оплаты
  useEffect(() => {
    const environment = getEnvironment();
    const isDevMode = environment === 'development';
    
    console.log('[Lesson] Environment detected:', environment);
    console.log('[Lesson] Is dev mode:', isDevMode);
    console.log('[Lesson] User data:', { isPaid: userData?.isPaid, userId: userData?.id });
    console.log('[Lesson] Lesson ID from router:', router.query.lessonId);
    
    // В dev режиме пропускаем проверку оплаты
    if (isDevMode) {
      setShowPaymentRequired(false);
    } else if (userData && !userData.isPaid) {
      // Урок 1 доступен для всех зарегистрированных пользователей
      const lessonId = router.query.lessonId;
      if (lessonId === '1') {
        setShowPaymentRequired(false);
      } else {
        setShowPaymentRequired(true);
      }
    } else {
      setShowPaymentRequired(false);
    }
  }, [userData, router.query.lessonId]);

  // Если пользователь не оплатил, показываем компонент PaymentRequired
  if (showPaymentRequired) {
    return (
      <>
        <Head>
          <title>Access Restricted - Lesson</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
        </Head>
        <EnvironmentInfo />
        <main>
          <PaymentRequired />
        <FooterInside />
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Money Compass Learning Course</title>
        <meta name="Money Compass Learning Course | Money Compass" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
 
      </Head>
      <EnvironmentInfo />
      <main>
        <Header token={token} userId={userId} />
        {/* <FooterInside /> */}
      </main>
     
    </>
  );
};

export default Lesson;
