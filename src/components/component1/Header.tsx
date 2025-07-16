import type { NextPage } from "next";
import styles from "./component1.module.scss";
import BurgerMenu from "./BurgerMenu";

export type HeaderType = {
  className?: string;
  onOpenModal?: () => void;
  hideLoginButton?: boolean;
  onBurgerClick?: () => void;
  isBurgerOpen?: boolean;
  burgerRef?: React.RefObject<HTMLDivElement>;
};

const Header: NextPage<HeaderType> = ({ className = "", onOpenModal, hideLoginButton = false, onBurgerClick, isBurgerOpen = false, burgerRef }) => {
  return (
    <header className={styles.frameGroup}>
      <div className={styles.frameWrapper}>
        <div className={styles.cosmoParent}>
          <h3 className={styles.cosmo}>Cosmo.</h3>
          <b className={styles.irena}>Irena</b>
        </div>
      </div>
      <div className={styles.frameContainer}>
        {!hideLoginButton && (
          <div 
            className={styles.wrapper}
            onClick={onOpenModal}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.div}>Sign In</div>
          </div>
        )}
        
        <a 
          className={styles.container}
          href="mailto:support@astro-irena.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.div1}>Ask a Question</div>
        </a>

        {hideLoginButton && onBurgerClick && (
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
  );
};

export default Header; 