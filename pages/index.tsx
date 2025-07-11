import Head from 'next/head';
import Component1 from "../src/components/component1/component1";
import Component2 from "../src/components/component2/component2";
import Component3 from "../src/components/component3/component3";
import Component4 from "../src/components/component4/component4";
import Component5 from "../src/components/component5/component5";
import Component6 from "../src/components/component6/component6";
import Component7 from "../src/components/component7/component7";
import Component8 from "../src/components/component8/component8";
import Component9 from "../src/components/component9/component9";
import SmartInvestment from "../src/components/smart-investment/smart-investment";
import Discover from "../src/components/discover/discover";
import Image from 'next/image';
import { useContext, useState, useEffect } from 'react';
import { Inter } from 'next/font/google';

import Header from '@/components/header/Header';
import Hero from '@/components/hero/Hero';
import ToLearn from '@/components/to-learn/ToLearn';
import About from '@/components/about/About';
import Way from '@/components/way/Way';
import Footer from '@/components/footer/Footer';
import Modal from '@/components/modal/Modal';

import { MainContext } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

const inter = Inter({ subsets: ['latin'] });

import { GetServerSideProps } from 'next';

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

    // Если пользователь авторизован, получаем его данные
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

  // Pass the cookies to the page as props
  return {
    props: {
      userId,
      token,
      userData: userData?.user || null,
    },
  };
};

export default function Home({
  userId,
  token,
  userData,
}: {
  userId: string | null;
  token: string | null;
  userData: any;
}) {
  const cc = useContext(MainContext);

  useEffect(() => {
    // GOOD: This state update is now in a useEffect and won't cause a warning
    cc?.setUserId(userId);
    cc?.setToken(token);
  }, [userId, token, userData]);

  return (
    <>
      <Head>
        <title>Колода карт таро Omen с обучающим курсом по Таро</title>
        <meta name="Колода карт таро Omen с обучающим курсом по Таро" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </Head>
      <main>
        <Component1 />
        <Component2 />
        <Discover />
        <Component3 />
        <Component4 />
        <Component5 />
        <Component6 />
        <SmartInvestment />
        <Component7 />
        <Component8 />
        <Component9 />
        <Modal />
        <Footer />
      </main>
    </>
  );
}
