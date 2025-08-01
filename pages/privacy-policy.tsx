import Head from 'next/head';
import { useContext, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { GetServerSideProps } from 'next';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { MainContext } from '@/contexts/MainContext';
import { YandexMetricaProvider } from 'next-yandex-metrica';
import { useRouter } from 'next/router';

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

        <Header />
        
        <main className="privacy-policy">
          <div className="privacy-policy__container">
            <div className="privacy-policy__content">
              <h1 className="privacy-policy__title">Политика конфиденциальности</h1>
              
              <div className="privacy-policy__section">
                <h2>1. Общие положения</h2>
                <p>
                  Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки персональных данных пользователей сайта и курсов Cosmo.Irena (далее — «Сайт», «Мы», «Нас»).
                </p>
                <p>
                  Используя наш Сайт и услуги, вы соглашаетесь с настоящей Политикой конфиденциальности.
                </p>
              </div>

              <div className="privacy-policy__section">
                <h2>2. Сбор информации</h2>
                <p>Мы собираем следующую информацию:</p>
                <ul>
                  <li>Персональные данные (имя, email, телефон)</li>
                  <li>Данные об использовании сайта и курсов</li>
                  <li>Техническая информация (IP-адрес, тип браузера)</li>
                  <li>Данные о платежах (через защищенные платежные системы)</li>
                </ul>
              </div>

              <div className="privacy-policy__section">
                <h2>3. Использование информации</h2>
                <p>Собранная информация используется для:</p>
                <ul>
                  <li>Предоставления доступа к курсам и материалам</li>
                  <li>Улучшения качества услуг</li>
                  <li>Обработки платежей</li>
                  <li>Связи с пользователями</li>
                  <li>Аналитики и статистики</li>
                </ul>
              </div>

              <div className="privacy-policy__section">
                <h2>4. Защита данных</h2>
                <p>
                  Мы принимаем необходимые меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.
                </p>
                <p>
                  Все платежные операции защищены современными технологиями шифрования.
                </p>
              </div>

              <div className="privacy-policy__section">
                <h2>5. Передача данных третьим лицам</h2>
                <p>
                  Мы не продаем, не обмениваем и не передаем ваши персональные данные третьим лицам, за исключением случаев:
                </p>
                <ul>
                  <li>Когда это необходимо для предоставления услуг</li>
                  <li>По требованию закона</li>
                  <li>С вашего явного согласия</li>
                </ul>
              </div>

              <div className="privacy-policy__section">
                <h2>6. Cookies и аналитика</h2>
                <p>
                  Мы используем cookies и аналитические инструменты для улучшения работы сайта и понимания поведения пользователей.
                </p>
                <p>
                  Вы можете отключить cookies в настройках вашего браузера.
                </p>
              </div>

              <div className="privacy-policy__section">
                <h2>7. Ваши права</h2>
                <p>Вы имеете право:</p>
                <ul>
                  <li>Получить доступ к своим персональным данным</li>
                  <li>Исправить неточные данные</li>
                  <li>Удалить свои данные</li>
                  <li>Ограничить обработку данных</li>
                  <li>Отозвать согласие на обработку</li>
                </ul>
              </div>

              <div className="privacy-policy__section">
                <h2>8. Изменения в Политике</h2>
                <p>
                  Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. 
                  О существенных изменениях мы будем уведомлять пользователей.
                </p>
              </div>

              <div className="privacy-policy__section">
                <h2>9. Контактная информация</h2>
                <p>
                  По всем вопросам, связанным с обработкой персональных данных, обращайтесь:
                </p>
                <p>
                  Email: privacy@cosmo-irena.com<br />
                  Instagram: <a href="https://www.instagram.com/cosmo.irena" target="_blank" rel="noopener noreferrer">@cosmo.irena</a>
                </p>
              </div>

              <div className="privacy-policy__section">
                <p className="privacy-policy__date">
                  <strong>Дата последнего обновления:</strong> 15 января 2025 года
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </YandexMetricaProvider>
  );
} 