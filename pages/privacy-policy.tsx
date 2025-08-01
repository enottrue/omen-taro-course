import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import { Inter } from 'next/font/google';
import { YandexMetricaProvider } from 'next-yandex-metrica';

import TextBlock from '@/components/text-block/textBlock';

const inter = Inter({ subsets: ['latin'] });

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

  return {
    props: {
      userId,
      token,
      userData: userData?.user || null,
    },
  };
};

export default function PrivacyPolicy({
  userId,
  token,
  userData,
}: {
  userId: string | null;
  token: string | null;
  userData: any;
}) {
  const cc = useContext(MainContext);
  const router = useRouter();

  useEffect(() => {
    cc?.setUserId(userId);
    cc?.setToken(token);
  }, [userId, token, userData]);

  return (
    <YandexMetricaProvider
      router={router as any}
      tagID={100786060}
      initParameters={{
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
      }}
    >
      <div className={inter.className}>
        <Head>
          <title>Политика конфиденциальности - Cosmo.Irena</title>
          <meta name="description" content="Политика конфиденциальности курсов Cosmo.Irena" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon/favicon.ico" />
        </Head>

        <TextBlock 
          token={token} 
          userId={userId}
          title="Политика конфиденциальности"
          subtitle="Cosmo.Irena"
          description="Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта и курсов Cosmo.Irena. Используя наш Сайт и услуги, вы соглашаетесь с настоящей Политикой конфиденциальности."
          buttonText="Скачать политику"
          buttonHref="/privacy-policy.pdf"
          showBackButton={false}
        />
      </div>
    </YandexMetricaProvider>
  );
}
