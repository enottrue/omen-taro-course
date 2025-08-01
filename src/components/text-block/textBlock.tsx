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
                    <p className="p">Политика конфиденциальности</p>
               
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
