import React from 'react';
import styles from './component1.module.scss';
import BurgerMenu from './BurgerMenu';

export type OnboardingMenuShellProps = {
  children: React.ReactNode;
  hideLoginButton?: boolean;
  onBurgerClick?: () => void;
  isBurgerOpen?: boolean;
  burgerRef?: React.RefObject<HTMLDivElement>;
};

const OnboardingMenuShell: React.FC<OnboardingMenuShellProps> = ({
  children,
  hideLoginButton = false,
  onBurgerClick,
  isBurgerOpen = false,
  burgerRef,
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.frameParent}>
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
              href="mailto:support@astro-irena.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.div1}>Ask a Question</div>
            </a>
            {onBurgerClick && (
              <div 
                ref={burgerRef}
                className={styles.burgerMenu}
                onClick={onBurgerClick}
                style={{ cursor: 'pointer', marginLeft: '10px', position: 'relative', minWidth: 'fit-content' }}
              >
                <div className={styles.burgerLine}></div>
                <div className={styles.burgerLine}></div>
                <div className={styles.burgerLine}></div>
                <BurgerMenu isOpen={isBurgerOpen} onClose={onBurgerClick} />
              </div>
            )}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
};

export default OnboardingMenuShell; 