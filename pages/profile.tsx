import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import Button from '@/components/button/Button';
import FooterInside from '@/components/footerInside/Footer';
import BurgerMenu from '@/components/component1/BurgerMenu';
import styles from '@/components/component1/component1.module.scss';
import LogoutIcon from '@/images/logout.svg';
import Modal from '@/components/modal/Modal';
import { useStripePayment } from '@/hooks/useStripePayment';
import Bitrix24DealStatus from '@/components/Bitrix24DealStatus';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const APP_SECRET = process.env.APP_SECRET;
  const cookies = context.req.headers.cookie
    ? cookie.parse(context.req.headers.cookie)
    : {};
  context.res.setHeader('Cache-Control', 'no-store');

  let userId = null;
  let token = null;
  let userData = null;

  try {
    //@ts-expect-error
    jwt.verify(cookies.Bearer, APP_SECRET);
    userId = cookies?.userId ? cookies.userId : null;
    token = cookies?.Bearer ? cookies.Bearer : null;

    // Получаем данные пользователя
    if (userId && token) {
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

const Profile = ({
  userId,
  token,
  userData,
}: {
  userId: string | null;
  token: string | null;
  userData: any;
}) => {
  const router = useRouter();
  const cc = useContext(MainContext);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cc?.setToken(token);
    cc?.setUserId(userId);
  }, [token, userId]);

  const handleBurgerClick = () => {
    setIsBurgerOpen(!isBurgerOpen);
  };

  // Close burger menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (burgerRef.current && !burgerRef.current.contains(event.target as Node)) {
        setIsBurgerOpen(false);
      }
    };

    if (isBurgerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBurgerOpen]);

  const handleLogout = () => {
    // Удаляем куки
    document.cookie = 'Bearer=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Перенаправляем на главную
    router.push('/');
  };

  const { handlePayment } = useStripePayment();
  
  // Функция для обработки успешного создания сделки
  const handleDealCreated = () => {
    // Перезагружаем страницу или обновляем данные
    window.location.reload();
  };

  const handleEnroll = async () => {
    try {
      await handlePayment();
    } catch (error) {
      console.error('Payment error:', error);
      // Если произошла ошибка, можно показать уведомление пользователю
    }
  };

  return (
    <>
      <Head>
        <title>Profile - Money Compass</title>
        <meta name="description" content="Your account profile and course enrollment" />
      </Head>

      <main className="profile-page">
        {/* Header с правильным дизайном как на courses */}
        <header className={styles.frameGroup}>
          <div className={styles.frameWrapper}>
            <div className={styles.cosmoParent}>
              <h3 className={styles.cosmo}>Cosmo.</h3>
              <b className={styles.irena}>Irena</b>
            </div>
          </div>
          <div className={styles.frameContainer}>
            <a 
              className={styles.container}
              href="mailto:support@astro-irena.com?subject=Вопрос по курсу Таро&body=Здравствуйте! У меня есть вопрос по курсу Таро:"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.div1}>Ask a Question</div>
            </a>
            {!token ? (
              <div 
                className={styles.wrapper}
                onClick={() => {
                  cc?.setModalOpen(true);
                  cc?.setCurrentForm('auth');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.div}>Sign In</div>
              </div>
            ) : (
              <div 
                ref={burgerRef}
                className={styles.burgerMenu}
                onClick={handleBurgerClick}
                style={{ cursor: 'pointer', marginLeft: '10px', position: 'relative', minWidth: 'fit-content' }}
              >
                <div className={styles.burgerLine}></div>
                <div className={styles.burgerLine}></div>
                <div className={styles.burgerLine}></div>
                <BurgerMenu isOpen={isBurgerOpen} onClose={handleBurgerClick} />
              </div>
            )}
          </div>
        </header>
        <div className="profile-container">
          {/* Your Account Block */}
          <div className="profile-block one">
            <div className="profile-block__header">
            <h2 className="profile-block__title">Your Account</h2>

            <div 
                className={styles.wrapper}
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.div} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Logout
                  <LogoutIcon style={{ width: '12px', height: '14px' }} />
                </div>
              </div>
            </div>
            
            <div className="profile-block__content">
              <div className="profile-email">
                {/* <span className="profile-email__label">Email:</span> */}
                <span className="profile-email__value">{userData?.email || 'user@example.com'}</span>
              </div>
            </div>
          </div>

          {/* Money Compass Description */}
          <div className="profile-block">
            <h2 className="profile-block__title">
              <span className="profile-block__title-italic">Money</span>{' '}
              <span className="profile-block__title-bold">Compass</span>
            </h2>
            
            <div className="profile-block__content">
              <div className="course-description">
                <p>
                An online astrology course that helps you uncover your true financial potential.
                </p>
                
                <p>Each lesson includes a video, personalized chart insights, and practical tools to help you understand:</p>
                
                <ul className="course-features">
                  <li>– Where your money is</li>
                  <li>– When to take action — and when to wait</li>
                </ul>
                
                <p>
                 You’ll discover your unique money talents, how to choose the right career path based on your chart, and how to create accurate financial forecasts — for yourself and your loved ones.
                </p>
                <p>
                 9 video lessons + downloadable materials.
                </p>
                <p>
                 Designed for real-life results — even if you’ve never studied astrology before.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="profile-block">
            <h2 className="profile-block__title">Order Summary</h2>
            
            <div className="profile-block__content">
              <div className="order-summary">
                <div className="order-summary__item">
                  <span className="order-summary__label">Subtotal</span>
                  <span className="order-summary__value">$50.00</span>
                </div>
                
                <div className="order-summary__item">
                  <span className="order-summary__label">Tax</span>
                  <span className="order-summary__value">$0.00</span>
                </div>
                
                <div className="order-summary__divider"></div>
                
                <div className="order-summary__item order-summary__item--total">
                  <span className="order-summary__label">Total</span>
                  <span className="order-summary__value">$50.00</span>
                </div>
              </div>
              
              {!userData?.bitrix24DealId ? (
                <Bitrix24DealStatus
                  userId={userId}
                  initialDealId={userData?.bitrix24DealId}
                  onDealCreated={handleDealCreated}
                />
              ) : (
                <Button
                  title="Enroll Now - only $50"
                  className="button_enroll"
                  onClick={handleEnroll}
                />
              )}
            </div>
          </div>
        </div>
        <Modal />
      </main>

      <FooterInside />
    </>
  );
};

export default Profile; 