import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import styles from '@/components/component1/component1.module.css';
import unsplashImage from '@/images/unsplashutbx9x3y8ly-2@2x.png';
import image3 from '@/images/image-3@2x.png';
import BurgerMenu from '@/components/component1/BurgerMenu';
import Footer from '@/components/footer/Footer';

const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);
  const cc = useContext(MainContext);

  useEffect(() => {
    if (router.query.session_id) {
      setSessionId(router.query.session_id as string);
    }
  }, [router.query]);

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

  return (
    <>
      <Head>
        <title>Payment Successful - Cosmo Course</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </Head>
      <main>
        <div className="root">
          <div className="">
            <Image
              className="unsplashutbx9x3y8ly-icon"
              alt="Background"
              src={unsplashImage}
              width={484}
              height={1853}
              priority
            />        
            <Image
              className="image-3-icon"
              alt=""
              src={image3}
              width={584}
              height={283}
              priority
            />
          </div>
          
          <section className="root-inner">
            <div className="frame-parent">
              {/* Header с правильным дизайном */}
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
                    href="mailto:support@astro-irena.com?subject=Вопрос по оплате курса&body=Здравствуйте! У меня есть вопрос по оплате курса:"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className={styles.div1}>Задать вопрос</div>
                  </a>
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
                </div>
              </header>
              
              <div className="frame-div">
                <div className="frame-parent1">
                  <div className="frame-parent2">
                    <div className="parent">
                      <h3 className="cosmo">
                        <p className="p">Payment</p>
                        <p className="p">Successful!</p>
                      </h3>
                      <h3 className="h31">
                        <p className="p">Thank you for</p>
                        <p className="p">purchasing the</p>
                        <p className="p">Cosmo Course!</p>
                      </h3>
                    </div>
                    
                    <div className="div1">
                      <p className="p">
                        Your payment has been processed successfully. You now have full access to the Cosmo Course.
                      </p>
                      <p className="p">&nbsp;</p>
                      <p className="p">
                        You will receive an email confirmation shortly with your login credentials. 
                        Access to the course will be available immediately.
                      </p>
                      <p className="p">&nbsp;</p>
                      {sessionId && (
                        <div style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                          padding: '1rem', 
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          marginTop: '1rem',
                        }}>
                          <strong style={{ color: 'var(--color-white)' }}>Session ID:</strong>
                          <p style={{ 
                            color: 'var(--color-white)', 
                            fontSize: '0.875rem',
                            marginTop: '0.5rem',
                            wordBreak: 'break-all'
                          }}>
                            {sessionId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Секция с кнопкой возврата */}
          <section className="cource-lessons bg-white">
            <div className="cource-book__button">
              <button
                onClick={() => router.push('/courses')}
                className="enroll-now-only-50-wrapper"
                style={{
                  cursor: 'pointer',
                  border: '0',
                  padding: 'var(--padding-14) var(--padding-20)',
                  backgroundColor: 'var(--color-white)',
                  alignSelf: 'stretch',
                  borderRadius: '964px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  margin: '0 auto',
                  marginTop: 'calcSize(16)',
                  fontFamily: 'var(--font-roboto)',
                  fontSize: 'var(--font-size-14)',
                  fontWeight: '700',
                  color: 'var(--color-midnightblue)'
                }}
              >
                Return to Courses
              </button>
            </div>
          </section>
          
          <div className="frame-wrapper2">
            <div className="frame-wrapper3">
              <div className="cosmo-group">
                <h3 className="cosmo">Cosmo.</h3>
                <b className="irena1">Irena</b>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentSuccessPage; 