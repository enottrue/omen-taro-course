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

import { useGetLazyUserData } from '@/hooks/useGetUserData';
import CourseHero from '@/components/course_hero/Course_hero';
import CourseLessons from '@/components/course_lessons/courseLessons';
import Footer from '@/components/footer/Footer';

import { apolloClient } from '@/lib/apollo/apollo';
import { GET_LESSON, GET_LESSONS } from '@/graphql/queries';
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
        <Header token={token} userId={userId} />
        <FooterInside />
      </main>
     
    </>
  );
};

export default Lesson;
