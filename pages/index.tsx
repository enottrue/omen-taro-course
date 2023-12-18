import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
// import styles from '@/styles/Home.module.css';
import Header from '@/components/header/Header';
import Hero from '@/components/hero/Hero';
import ToLearn from '@/components/to-learn/ToLearn';
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
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
      </main>
    </>
  );
}
