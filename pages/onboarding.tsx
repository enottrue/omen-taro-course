import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isOnboardingEnabled, setOnboardingStatus } from '@/utils/onboardingUtils';
import Head from 'next/head';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import { useMetrica } from 'next-yandex-metrica';

import OnboardingStages from '@/components/onboarding/OnboardingStages';
import Footer from '@/components/footer/Footer';
import { useGetLazyUserData } from '@/hooks/useGetUserData';

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

  // Pass the cookies to the page as props
  return {
    props: {
      userId,
      token,
    },
  };
};

const Onboarding = ({
  userId,
  token,
}: {
  userId: string | null;
  token: string | null;
}) => {
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
    // Send Yandex Metrica event for onboarding page view
    reachGoal('onboarding_page_viewed');
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

  useEffect(() => {
    // Check if onboarding is enabled via environment variable
    if (!isOnboardingEnabled()) {
      console.log('🚫 Onboarding disabled via environment variable, redirecting to courses');
      router.push('/courses');
      return;
    }

    const isOnboarded = localStorage.getItem('onboarded');

    if (isOnboarded === 'true') {
      router.push('/courses');
    }
  }, []);

  const handleOnboardingComplete = () => {
    // Set onboarding flag in local storage
    setOnboardingStatus('true');

    // Redirect to home page
    router.push('/courses');
  };

  return (
    <>
      <Head>
        <title>Cosmo Irena Deck with Tarot Learning Course</title>
        <meta name="Tarot Learning Course - Omen | Introduction" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="shortcut icon" href="/favicon/favicon.ico" />
 
      </Head>
      <main>
        <OnboardingStages />

        {/* <div>
          <h1>Welcome to the Onboarding Page!</h1>
          <button onClick={handleOnboardingComplete}>
            Complete Onboarding
          </button>
        </div> */}
      </main>
    </>
  );
};

export default Onboarding;
