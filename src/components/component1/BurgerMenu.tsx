import type { NextPage } from "next";
import styles from "./component1.module.css";
import { useContext } from "react";
import { MainContext } from "@/contexts/MainContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from 'js-cookie';

export type BurgerMenuType = {
  isOpen: boolean;
  onClose: () => void;
};

const BurgerMenu: NextPage<BurgerMenuType> = ({ isOpen, onClose }) => {
  const cc = useContext(MainContext);
  const router = useRouter();
  const isAuthenticated = !!(cc?.token && cc?.user);

  if (!isOpen) return null;

  const handleLogout = () => {
    Cookies.remove('Bearer');
    Cookies.remove('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    cc?.setToken(null);
    cc?.setUserId(null);
    cc?.setUser(null);
    cc?.setMenuOpen(false);
    onClose();
    router.push('/');
  };

  const getActiveClass = (path: string) => {
    return router.asPath === path ? 'active' : '';
  };

  if (isAuthenticated) {
    // Меню для авторизованных пользователей
    return (
      <div className={styles.burgerDropdown}>
        <div className={styles.burgerDropdownContent}>
          <div className={styles.burgerMenuItem}>
            <Link href="/" legacyBehavior>
              <a className={getActiveClass('/')} onClick={onClose}>Главная</a>
            </Link>
          </div>
          <div className={styles.burgerMenuItem}>
            <Link href="/course_book" legacyBehavior>
              <a className={getActiveClass('/course_book')} onClick={onClose}>Методичка</a>
            </Link>
          </div>
          <div className={styles.burgerMenuItem}>
            <Link href="/courses" legacyBehavior>
              <a className={getActiveClass('/courses')} onClick={onClose}>Обучающий курс</a>
            </Link>
          </div>
          <div className={styles.burgerMenuItem} onClick={handleLogout}>
            <span>Выйти</span>
          </div>
        </div>
      </div>
    );
  }

  // Меню для неавторизованных пользователей (оставляем как есть)
  return (
    <div className={styles.burgerDropdown}>
      <div className={styles.burgerDropdownContent}>
        <div className={styles.burgerMenuItem} onClick={onClose}>
          <span>Sign In</span>
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