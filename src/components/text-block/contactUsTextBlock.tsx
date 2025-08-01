import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import styles from '@/components/component1/component1.module.scss';
import BurgerMenu from '../component1/BurgerMenu';

const ContactUsTextBlock = () => {
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
                    <p className="p">Contact us</p>
                  </h3>
                </div>
                
                <div className="div1">
                  <p className="p">
                    <strong>Phone:</strong> +372 504 2314
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>Email:</strong> info@astro-irena.com
                  </p>
                  <p className="p">&nbsp;</p>
                  <p className="p">
                    <strong>Address:</strong> ESTONIA, Tallinn, Ravala pst 13-32.
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

export default ContactUsTextBlock; 