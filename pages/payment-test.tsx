import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import PaymentStatus from '@/components/PaymentStatus';
import PaymentRequired from '@/components/PaymentRequired';
import Footer from '@/components/footer/Footer';

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

export default function PaymentTest({
  userId,
  token,
  userData,
}: {
  userId: string | null;
  token: string | null;
  userData: any;
}) {
  const router = useRouter();
  const context = useContext(MainContext);
  const [showPaymentRequired, setShowPaymentRequired] = useState(false);

  useEffect(() => {
    context?.setUserId(userId);
    context?.setToken(token);

    if (!userId || !token) {
      router.push('/');
    }
  }, [userId, token]);

  // Проверяем статус оплаты
  useEffect(() => {
    if (userData && !userData.isPaid) {
      setShowPaymentRequired(true);
    } else {
      setShowPaymentRequired(false);
    }
  }, [userData]);

  return (
    <>
      <Head>
        <title>Тест системы оплаты</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </Head>
      <main style={{ padding: '2rem' }}>
        <h1>Тест системы оплаты</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2>Информация о пользователе:</h2>
          <p><strong>ID:</strong> {userId || 'Не авторизован'}</p>
          <p><strong>Статус оплаты:</strong> {userData?.isPaid ? 'Оплачено' : 'Не оплачено'}</p>
          <p><strong>Email:</strong> {userData?.email || 'Не указан'}</p>
          <p><strong>Имя:</strong> {userData?.name || 'Не указано'}</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>Компонент PaymentStatus (административный):</h2>
          {userId && (
            <PaymentStatus 
              userId={userData?.id}
              isPaid={userData?.isPaid}
              onStatusChange={(isPaid) => {
                console.log(`Статус оплаты изменен на: ${isPaid ? 'Оплачено' : 'Не оплачено'}`);
                // Перезагружаем страницу для обновления данных
                router.reload();
              }}
            />
          )}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>Компонент PaymentStatus (для пользователя):</h2>
          <PaymentStatus 
            userId={userData?.id}
            isPaid={userData?.isPaid}
            showPaymentButton={true}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>Компонент PaymentRequired:</h2>
          {showPaymentRequired ? (
            <PaymentRequired />
          ) : (
            <div style={{ 
              padding: '2rem', 
              backgroundColor: '#d4edda', 
              border: '1px solid #c3e6cb',
              borderRadius: '5px',
              color: '#155724'
            }}>
              <h3>✅ Доступ разрешен</h3>
              <p>Пользователь оплатил курс и имеет доступ ко всем материалам.</p>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>Тестовые ссылки:</h2>
          <ul>
            <li><a href="/courses">Страница курсов</a></li>
            <li><a href="/course_book">Книга курса</a></li>
            <li><a href="/lesson/1/1">Урок 1, Этап 1</a></li>
            <li><a href="/">Главная страница</a></li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
} 