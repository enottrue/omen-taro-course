import React, { useState, useRef, useEffect } from 'react';
import book from '@/images/tu@2x.png';
import Image from 'next/image';
import Button from '../button/Button';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import styles from '@/components/component1/component1.module.scss';
import unsplashImage from '../../images/unsplashutbx9x3y8ly-2@2x.png';
import image3 from '../../images/image-3@2x.png';
import BurgerMenu from '../component1/BurgerMenu';

const TextBlock = () => {
  const router = useRouter();
  const cc = useContext(MainContext);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = !!(cc?.token && cc?.user);

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
          {/* Header внутри root с правильными отступами */}
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
                href="mailto:support@astro-irena.com?subject=Вопрос по методичке Таро&body=Здравствуйте! У меня есть вопрос по методичке Таро:"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.div1}>Ask a Question</div>
              </a>
              {!isAuthenticated ? (
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
      
          
          <div className="frame-div">
            <div className="frame-parent1">
              <div className="frame-parent2">
                <div className="parent">
                  <h3 className="cosmo">
                    <p className="p">Privacy Policy</p>
                  </h3>
                </div>
                
                <div className="div1">
                  <p className="p">
                    This Privacy Policy describes how we collect, use, and protect your personal information when you use our website and services.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    By using our Site and services, you agree to this Privacy Policy. We take necessary measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    We collect information such as your name, email address, phone number, and usage data to provide you with access to courses and materials, improve our services, process payments, and communicate with you.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    We do not sell, exchange, or transfer your personal data to third parties except when necessary to provide services, required by law, or with your explicit consent.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    You have the right to access, correct, delete your personal data, restrict processing, and withdraw consent. For questions about data processing, contact us at support@astro-irena.com
                  </p>
                </div>
              </div>
{/* 
              <div className="cource-book__button">
                <Button
                  title="Download Policy"
                  isLink
                  href="/privacy-policy.pdf"
                  target="_blank"
                  className="enroll-now-only-50-wrapper"
                >
                  <span className="cource-book__icon-download">
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.09466 1.48537L8 11.4849" stroke="#002B80" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M15 16.0668H1" stroke="#002B80" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M2.29676 6.59003L7.24651 11.5398C7.63703 11.9303 8.2702 11.9303 8.66072 11.5398L13.6105 6.59003" stroke="#002B80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.29676 6.59003L7.24651 11.5398C7.63703 11.9303 8.2702 11.9303 8.66072 11.5398L13.6105 6.59003" stroke="#002B80" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </section>
      
      {/* Секция с кнопкой назад */}
     
      
      <div className="frame-wrapper2">
        <div className="frame-wrapper3">
          <div className="cosmo-group">
            <h3 className="cosmo">Cosmo.</h3>
            <b className="irena1">Irena</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextBlock;
