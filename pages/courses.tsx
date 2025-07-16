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
import Footer from '@/components/footer/Footer';

import { apolloClient } from '@/lib/apollo/apollo';
import { GET_COURSES, GET_COURSE, GET_STAGE_STATUS } from '@/graphql/queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import styles from '@/components/component1/component1.module.scss';
import Component2 from '@/components/component2/component2';
import CourseLessons from '@/components/course_lessons/courseLessons';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const APP_SECRET = process.env.APP_SECRET;
  const cookies = context.req.headers.cookie
    ? cookie.parse(context.req.headers.cookie)
    : {};
  context.res.setHeader('Cache-Control', 'no-store');

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

const Cources = ({
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
}) => {
  const router = useRouter();
  const [showPaymentRequired, setShowPaymentRequired] = useState(false);

  // Use the courses data from server-side props instead of making a client-side query
  const tt = { getCourse: courses || null };

  const {
    fetchUser,
    loading: loadingLazy,
    error: errorLazy,
    user,
  } = useGetLazyUserData();

  const cc = useContext(MainContext);
  console.log(
    'token',
    token,
    'userId',
    userId,
    'data',
    courses,
    'stageData',
    stageData,
    'userData',
    userData,
  );
  
  useEffect(() => {
    stageData && cc?.setStageData(stageData);
  }, [stageData]);

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

  useEffect(() => {
    if (cc && userId && courses) {
      cc.setCourses(courses);
      cc.setLessons(courses.lessons || []);
    }
  }, [cc, userId, courses]);

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
          <title>Доступ ограничен - Обучающий курс по Таро</title>
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
        <CourseHero lessons={courses?.lessons} token={token} userId={userId} />
        <Component2 textShown={false} typePage="courses"/>
        <CourseLessons lessons={courses?.lessons} />
      </main>
      <Footer />
    </>
  );
};

export default Cources;
