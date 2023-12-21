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

  const {
    getUser,
    loading: loadingLazy,
    error: errorLazy,
    user,
  } = useGetLazyUserData(Number(userId));

  const cc = useContext(MainContext);
  console.log('cc', cc);
  console.log('token', token, 'userId', userId);

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

  useEffect(() => {
    const isOnboarded = localStorage.getItem('onboarded');

    if (isOnboarded === 'true') {
      router.push('/courses');
    }
  }, []);

  const handleOnboardingComplete = () => {
    // Set onboarding flag in local storage
    localStorage.setItem('onboarded', 'true');

    // Redirect to home page
    router.push('/courses');
  };

  return (
    <>
      <Head>
        <title>Колода карт таро Omen с обучающим курсом по Таро</title>
        <meta name="Обучающий курс по Таро - Omen | Введение" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header token={token} userId={userId} />
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
