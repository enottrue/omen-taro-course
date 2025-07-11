import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import OnboardingStages from '@/components/onboarding/OnboardingStages';

import { useGetLazyUserData } from '@/hooks/useGetUserData';
import CourseHero from '@/components/course_hero/Course_hero';
import Footer from '@/components/footer/Footer';

import { apolloClient } from '@/lib/apollo/apollo';
import { GET_COURSES, GET_COURSE, GET_STAGE_STATUS } from '@/graphql/queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import styles from '@/components/component1/component1.module.css';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const APP_SECRET = process.env.APP_SECRET;
  const cookies = context.req.headers.cookie
    ? cookie.parse(context.req.headers.cookie)
    : {};
  context.res.setHeader('Cache-Control', 'no-store');

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
        courses: null,
        stageData: [],
      },
    };
  }
  // Pass the cookies to the page as props
  return {
    props: {
      userId,
      token,
    },
  };
};

const Cources = ({
  userId,
  token,
  courses,
  stageData,
}: {
  userId: string | null;
  token: string | null;
  courses:
    | {
        [k: string]: any;
      }
    | undefined;
  stageData: { [k: string]: any };
}) => {
  const router = useRouter();

  // Use the courses data from server-side props instead of making a client-side query
  const tt = { getCourse: courses || null };

  const {
    getUser,
    loading: loadingLazy,
    error: errorLazy,
    user,
  } = useGetLazyUserData(Number(userId));

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
  );
  useEffect(() => {
    stageData && cc?.setStageData(stageData);
  }, [stageData]);

  useEffect(() => {
    cc?.setUserId(userId);
    cc?.setToken(token);
    const us = getUser({ variables: { userId } });

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
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </Head>
      <main>
        <CourseHero lessons={courses?.lessons} token={token} userId={userId} />
      </main>
      <Footer />
    </>
  );
};

export default Cources;
