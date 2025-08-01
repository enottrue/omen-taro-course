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

interface TextBlockProps {
  token?: string | null;
  userId?: string | null;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
}

const TextBlock = ({ 
  token, 
  userId, 
  title = "Электронное методическое пособие",
  subtitle = "по Таро А.Э.Уэйта",
  description = "В этом электронном методическом пособии вы найдете значения арканов, историю возникновения колоды Таро А. Уэйта и расклады.",
  buttonText = "Скачать методичку",
  buttonHref = "/Omen_taro_book_new.pdf",
  showBackButton = true,
  backButtonText = "Назад к курсам",
  backButtonHref = "/courses"
}: TextBlockProps) => {
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
          
          <div className="frame-div">
            <div className="frame-parent1">
              <div className="frame-parent2">
                <div className="parent">
                  <h3 className="cosmo">
                    <p className="p">{title}</p>
                  </h3>
                  <h3 className="h31">
                    <p className="p">{subtitle}</p>
                  </h3>
                </div>
                
                <div className="div1">
                  <p className="p">{description}</p>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>
      
      {/* Секция с кнопкой назад */}
      {showBackButton && (
        <section className="cource-lessons">
          <div className="cource-book__button">
            <Button
              title={backButtonText}
              isLink
              href={backButtonHref}
              className="enroll-now-only-50-wrapper"
              onClick={() => router.back()}
            >
            </Button>
          </div>
        </section>
      )}
      
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
