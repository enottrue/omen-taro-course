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

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const cc = useContext(MainContext);

  return (
    <>
      <Head>
        <title>Колода карт таро Omen с обучающим курсом по Таро</title>
        <meta name="Колода карт таро Omen с обучающим курсом по Таро" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
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
