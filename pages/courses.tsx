import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import OnboardingStages from '@/components/onboarding/OnboardingStages';
// import PaymentRequired from '@/components/PaymentRequired'; // Убираем, так как не используем
import { useMetrica } from 'next-yandex-metrica';

import { useGetLazyUserData } from '@/hooks/useGetUserData';
import CourseHero from '@/components/course_hero/Course_hero';
import FooterInside from '@/components/footerInside/Footer';

import { apolloClient } from '@/lib/apollo/apollo';
import { GET_COURSES, GET_COURSE, GET_STAGE_STATUS } from '@/graphql/queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import styles from '@/components/component1/component1.module.scss';
import Component2 from '@/components/component2/component2';
import CourseLessons from '@/components/course_lessons/courseLessons';
import { getDefaultCourseIdString } from '@/utils/courseUtils';
import { getEnvironment } from '@/utils/environment';
import { EnvironmentInfo } from '@/components/EnvironmentInfo';

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
    if (!APP_SECRET) {
      console.log('[Courses] getServerSideProps - APP_SECRET not found, skipping JWT verification');
      // В production без APP_SECRET пропускаем JWT верификацию
      userId = cookies?.userId ? cookies.userId : null;
      token = cookies?.Bearer ? cookies.Bearer : null;
    } else {
      jwt.verify(cookies.Bearer, APP_SECRET);
      userId = cookies?.userId ? cookies.userId : null;
      token = cookies?.Bearer ? cookies.Bearer : null;
    }
    
    console.log('[Courses] getServerSideProps - JWT verified, userId:', userId, 'token exists:', !!token);

    // Получаем данные пользователя для проверки статуса оплаты
    if (userId && token) {
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
    console.log('[Courses] getServerSideProps - JWT verification failed, setting userId and token to null');
    userId = null;
    token = null;
  }

  try {
    const { data } = await apolloClient.query({
      query: GET_COURSE,
      variables: {
        id: getDefaultCourseIdString(), // Use environment variable for course ID
        userId: userId ? Number(userId) : 1, // Use number 1 for unauthenticated users
      },
    });

    // Data loaded successfully
    console.log('courses.tsx getServerSideProps - lessons loaded:', data?.getCourse?.lessons?.length || 0);
    console.log('courses.tsx getServerSideProps - full course data:', {
      courseId: data?.getCourse?.id,
      courseName: data?.getCourse?.name,
      lessonsCount: data?.getCourse?.lessons?.length || 0,
      lessons: data?.getCourse?.lessons?.map((l: any) => ({ 
        id: l.id, 
        name: l.lessonName, 
        stagesCount: l.lessonStages?.length || 0 
      }))
    });
    
    let stageData = null;
    if (userId && token) {
      const { data } = await apolloClient.query({
        query: GET_STAGE_STATUS,
        variables: {
          userId: Number(userId),
        },
      });
      stageData = data;
    }

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
  // const [showPaymentRequired, setShowPaymentRequired] = useState(false); // Убираем, так как не используем
  const { reachGoal } = useMetrica();

  // Use the courses data from server-side props instead of making a client-side query
  const tt = { getCourse: courses || null };

  const {
    fetchUser,
    loading: loadingLazy,
    error: errorLazy,
    user,
  } = useGetLazyUserData();

  const cc = useContext(MainContext);
  console.log('courses.tsx component - lessons from props:', courses?.lessons?.length || 0);
  console.log('courses.tsx component - user auth status:', { userId, token, hasUserData: !!userData });
  
  useEffect(() => {
    stageData && cc?.setStageData(stageData);
  }, [stageData]);

  useEffect(() => {
    // Send Yandex Metrica event for courses page view
    reachGoal('courses_page_viewed');
  }, [reachGoal]);

  useEffect(() => {
    cc?.setUserId(userId);
    cc?.setToken(token);
    
    if (userId) {
      fetchUser(Number(userId));
    }

    // Убираем редирект полностью - как в DEV режиме
    // if (!userId && !token) {
    //   router.push('/');
    // }
  }, [userId, token]);

  useEffect(() => {
    if (user) {
      // Handle the case when the user data is not found
      cc?.setUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (cc && userId && courses) {
      console.log('Setting courses and lessons in context:', {
        userId,
        courses,
        lessonsCount: courses.lessons?.length || 0,
        firstLesson: courses.lessons?.[0]
      });
      cc.setCourses(courses);
      cc.setLessons(courses.lessons || []);
    }
  }, [cc, userId, courses]);

  // Убираем проверку статуса оплаты - всегда показываем страницу курсов (как в DEV режиме)
  // useEffect(() => {
  //   const environment = getEnvironment();
  //   const isDevMode = environment === 'development';
  //   
  //   console.log('[Courses] Environment detected:', environment);
  //   console.log('[Courses] Is dev mode:', isDevMode);
  //   console.log('[Courses] User data:', { isPaid: userData?.isPaid, userId: userData?.id });
  //   console.log('[Courses] Auth data:', { userId, hasToken: !!token });
  //   
  //   // НИКОГДА не показываем PaymentRequired - как в DEV режиме
  //   setShowPaymentRequired(false);
  // }, [userData, userId, token]);

  // Убираем проверку авторизации - как в DEV режиме
  // if (!userId && !token) {
  //   return (
  //     <>
  //       <Head>
  //         <title>Loading - Money Compass Learning Course</title>
  //         <meta name="viewport" content="width=device-width, initial-scale=1" />
  //         <link rel="shortcut icon" href="/favicon/favicon.ico" />
  //       </Head>
  //       <EnvironmentInfo />
  //       <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //         <div>Redirecting...</div>
  //       </main>
  //     </>
  //   );
  // }

  // Убираем показ PaymentRequired - всегда показываем страницу курсов (как в DEV режиме)
  // if (showPaymentRequired) {
  //   return (
  //     <>
  //       <Head>
  //         <title>Access Restricted - Money Compass Learning Course</title>
  //         <meta name="viewport" content="width=device-width, initial-scale=1" />
  //         <link rel="shortcut icon" href="/favicon/favicon.ico" />
  //       </Head>
  //       <EnvironmentInfo />
  //       <main>
  //         <PaymentRequired />
  //         <FooterInside />
  //       </main>

  //     </>
  //   );
  // }

  return (
    <>
      <Head>
        <title>Money Compass training course</title>
        <meta name="Money Compass training course | Money Compass" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </Head>
      <EnvironmentInfo />
      <main>
        <CourseHero lessons={courses?.lessons} token={token} userId={userId} />
        <Component2 textShown={false} typePage="courses" videoSource="/videos/intro_course.mp4" />
        <CourseLessons lessons={courses?.lessons} />
      </main>
      <FooterInside />
    </>
  );
};

export default Cources;
