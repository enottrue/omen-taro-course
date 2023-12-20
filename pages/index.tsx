import Head from 'next/head';
import Image from 'next/image';
import { useContext } from 'react';
import { Inter } from 'next/font/google';
// import styles from '@/styles/Home.module.css';
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
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

import { GetServerSideProps } from 'next';

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

export default function Home({
  userId,
  token,
}: {
  userId: string | null;
  token: string | null;
}) {
  const cc = useContext(MainContext);

  useEffect(() => {
    // GOOD: This state update is now in a useEffect and won't cause a warning
    cc?.setUserId(userId);
    cc?.setToken(token);
  }, [userId, token]);

  return (
    <>
      <Head>
        <title>Колода карт таро Omen с обучающим курсом по Таро</title>
        <meta name="Колода карт таро Omen с обучающим курсом по Таро" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header token={token} userId={userId} />
        <Hero />
        <ToLearn />
        <About />
        <Way />
        <Footer />
      </main>
      <Modal />
    </>
  );
}
