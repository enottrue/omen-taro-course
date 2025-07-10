import React from 'react';
import Link from 'next/link';
import Button from '../button/Button';
import Logout from '@/images/svg/logout.svg';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const AuthNav: React.FC = () => {
  const router = useRouter();
  const cc = useContext(MainContext);
  const [activePath, setActivePath] = useState('');
  
  // Отладочная информация
  console.log('AuthNav rendered:', {
    menuOpen: cc?.menuOpen,
    token: cc?.token,
    userId: cc?.userId
  });

  useEffect(() => {
    setActivePath(router.asPath);
  }, [router.asPath]);

  const getActiveClass = (path: string) => {
    return activePath === path ? 'active' : '';
  };

  const handleClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    // Change context values here
    cc?.setMenuOpen(false);
    // Navigate to the link
    router.push(path);
  };
  return (
    <nav className="header__nav">
      <ul>
        {/* <li>
          <Link href="#" legacyBehavior>
            <a>Личный кабинет</a>
          </Link>
        </li> */}
        <li className={getActiveClass('/')}>
          <Link href="/" legacyBehavior>
            <a onClick={(e) => handleClick(e, '/')}>Главная</a>
          </Link>
        </li>
        <li className={getActiveClass('/course_book')}>
          <Link href="/course_book" legacyBehavior>
            <a onClick={(e) => handleClick(e, '/course_book')}>Методичка</a>
          </Link>
        </li>
        <li className={getActiveClass('/courses')}>
          <Link href="/courses" legacyBehavior>
            <a onClick={(e) => handleClick(e, '/courses')}>Обучающий курс</a>
          </Link>
        </li>
        {/* <li>
          <Link href="#" legacyBehavior>
            <a>Магазин раскладов</a>
          </Link>
        </li> */}
      </ul>
      <Button
        title="Выйти"
        className="button_little button_secondary logout"
        onClick={() => {
          Cookies.remove('Bearer');
          Cookies.remove('userId');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          cc?.setMenuOpen(!cc?.menuOpen);
          router.push('/');
        }}
      >
        <span className="header__icon">
          <Logout className="" />
        </span>
      </Button>
    </nav>
  );
};

export default AuthNav;
