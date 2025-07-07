import type { NextPage } from "next";
import styles from "./component1.module.css";

export type BurgerMenuType = {
  isOpen: boolean;
  onClose: () => void;
};

const BurgerMenu: NextPage<BurgerMenuType> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.burgerDropdown}>
      <div className={styles.burgerDropdownContent}>
        <div className={styles.burgerMenuItem} onClick={onClose}>
          <span>Вход</span>
        </div>
        <div className={styles.burgerMenuItem} onClick={onClose}>
          <span>Регистрация</span>
        </div>
        <div className={styles.burgerMenuItem} onClick={onClose}>
          <span>О нас</span>
        </div>
        <div className={styles.burgerMenuItem} onClick={onClose}>
          <span>Контакты</span>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenu; 