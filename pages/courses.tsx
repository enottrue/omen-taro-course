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
import { GET_COURSES, GET_COURSE } from '@/graphql/queries';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const APP_SECRET = process.env.APP_SECRET;
  const cookies = context.req.headers.cookie
    ? cookie.parse(context.req.headers.cookie)
    : {};

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
      },
    });

    return {
      props: {
        userId,
        token,
        courses: data.getCourse, // Pass the courses data to the component
      },
    };
  } catch (error) {
    console.log('error', error);
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
}: {
  userId: string | null;
  token: string | null;
  courses:
    | {
        [k: string]: any;
      }
    | undefined;
}) => {
  const router = useRouter();

  useEffect(() => {
    console.log(123233, courses);
  }, [courses]);

  const {
    getUser,
    loading: loadingLazy,
    error: errorLazy,
    user,
  } = useGetLazyUserData(Number(userId));

  const cc = useContext(MainContext);
  console.log('cc', cc);
  console.log('token', token, 'userId', userId, 'data', courses);

  useEffect(() => {
    cc?.setUserId(userId);
    cc?.setToken(token);
    const us = getUser({ variables: { userId } });
    console.log('user', user, us, loadingLazy, errorLazy);

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
        <CourseHero />
        <CourseLessons lessons={courses?.lessons} />
      </main>
      <Footer />
    </>
  );
};

export default Cources;
