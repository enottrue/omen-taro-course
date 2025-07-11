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
import Footer from '@/components/footer/Footer';
import CourseBookHero from '@/components/course_book/courseBook';

import { apolloClient } from '@/lib/apollo/apollo';
import { GET_COURSES, GET_COURSE, GET_STAGE_STATUS } from '@/graphql/queries';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const APP_SECRET = process.env.APP_SECRET;
  const cookies = context.req.headers.cookie
    ? cookie.parse(context.req.headers.cookie)
    : {};

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
    const { data } = await apolloClient.query({
      query: GET_COURSE,
      variables: {
        id: 1,
        userId: userId ? Number(userId) : 1, // Use number 1 for unauthenticated users
      },
    });

    // Data loaded successfully
    
    const { data: stageData } = await apolloClient.query({
      query: GET_STAGE_STATUS,
      variables: {
        userId: Number(userId),
      },
    });

    return {
      props: {
        userId,
        token,
        userData: userData?.user || null,
        courses: data?.getCourse || null, // Handle undefined data
        stageData: stageData?.getStageStatus || [],
      },
    };
  } catch (error) {
    console.log('error', error);
    return {
      props: {
        userId,
        token,
        userData: userData?.user || null,
        courses: null,
        stageData: [],
      },
    };
  }
};

export default function CourseBook({
  userId,
  token,
  userData,
  courses,
  stageData,
}: {
  userId: string | null;
  token: string | null;
  userData: any;
  courses:
    | {
        [k: string]: any;
      }
    | undefined;
  stageData: { [k: string]: any };
}) {
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
    stageData && cc?.setStageData(stageData);
  }, [stageData]);

  useEffect(() => {
    // GOOD: This state update is now in a useEffect and won't cause a warning
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
          <title>Доступ ограничен - Книга курса</title>
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
        <title>Книга курса - Обучающий курс по Таро</title>
        <meta name="Книга курса - Omen | Курс Таро" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </Head>
      <main>
        <CourseBookHero />
      </main>
      <Footer />
    </>
  );
}
