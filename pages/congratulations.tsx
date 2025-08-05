import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useContext } from 'react';
import { MainContext, MainContextProvider } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import { useMetrica } from 'next-yandex-metrica';

import { useGetLazyUserData } from '@/hooks/useGetUserData';
import Footer from '@/components/footer/Footer';
import TextBlock from '@/components/text-block/congratulationsTextBlock';
import Modal from '@/components/modal/Modal';

import { apolloClient } from '@/lib/apollo/apollo';
import { GET_COURSES, GET_COURSE, GET_STAGE_STATUS } from '@/graphql/queries';
import { getDefaultCourseIdString } from '@/utils/courseUtils';

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
        id: getDefaultCourseIdString(), // Use environment variable for course ID
        userId: userId ? Number(userId) : 1, // Use number 1 for unauthenticated users
      },
    });

    // Data loaded successfully
    
    const stageDataResult = await apolloClient.query({
      query: GET_STAGE_STATUS,
      variables: {
        userId: Number(userId),
      },
    });
    
    const stageData = stageDataResult?.data?.getStageStatus || [];

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

export default function Congratulations({
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
  const { reachGoal } = useMetrica();

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
    // Send Yandex Metrica event for congratulations page view
    reachGoal('congratulations_page_viewed');
  }, [reachGoal]);

  useEffect(() => {
    // GOOD: This state update is now in a useEffect and won't cause a warning
    cc?.setUserId(userId);
    cc?.setToken(token);
    
    if (userId) {
      fetchUser(Number(userId));
    }
  }, [userId, token]);

  useEffect(() => {
    if (user) {
      // Handle the case when the user data is not found
      cc?.setUser(user);
    }
  }, [user]);

  return (
    <MainContextProvider>
      <Head>
        <title>Congratulations - Cosmo.Irena</title>
        <meta name="description" content="Congratulations on completing the Cosmo.Irena course" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </Head>
      <main>
        <TextBlock />
        <Modal />
        <Footer />
      </main>
    </MainContextProvider>
  );
} 