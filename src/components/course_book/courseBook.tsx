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

interface CourseBookHeroProps {
  token?: string | null;
  userId?: string | null;
}

const CourseBookHero = ({ token, userId }: CourseBookHeroProps) => {
  const router = useRouter();
  const cc = useContext(MainContext);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const burgerRef = useRef<HTMLDivElement>(null);

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
                <div className={styles.div1}>Задать вопрос</div>
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
        <div className="cource-book__img">
          <Image src={book} alt="Электронная методичка" priority />
        </div>
          <div className="frame-div">
            <div className="frame-parent1">
              <div className="frame-parent2">
                <div className="parent">
                  <h3 className="cosmo">
                    <p className="p">Электронное</p>
                    <p className="p">методическое</p>
                    <p className="p">пособие</p>
                  </h3>
                  <h3 className="h31">
                    <p className="p">по Таро</p>
                    <p className="p">А.Э.Уэйта</p>
                  </h3>
                </div>
                
                <div className="div1">
                  <p className="p">
                    В этом электронном методическом пособии вы найдете значения арканов, 
                    историю возникновения колоды Таро А. Уэйта и расклады.
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    Если в процессе работы с картами вам понадобится определенная информация, 
                    вы можете не пересматривать заново курс, а воспользоваться электронным
                    пособием, максимально приближенным к курсу. Это позволит вам
          быстрее ориентироваться в раскладах.
        </p>
                </div>
      </div>

      <div className="cource-book__button">
        <Button
          title="Скачать методичку"
          isLink
          href="/Omen_taro_book_new.pdf"
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
      </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Секция с изображением книги */}
      <section className="cource-lessons bg-white">
        
      <div className="cource-book__button">
        <Button
            title="Назад к курсам"
          isLink
          href="/courses"
          className="enroll-now-only-50-wrapper"
          onClick={() => router.back()}
        >
        </Button>
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
  );
};

export default CourseBookHero;
