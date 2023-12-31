import React from 'react';
import Link from 'next/link';
import Button from '../button/Button';
import Logout from '@/images/svg/logout.svg';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const AuthNav: React.FC = () => {
  const router = useRouter();
  const isActive01 = router.asPath === '/';
  const isActive02 = router.asPath === '/courses';
  const isActive03 = router.asPath === '/course_book';

  const cc = useContext(MainContext);

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
        <li className={isActive01 ? `active` : ''}>
          <Link href="/" legacyBehavior>
            <a onClick={(e) => handleClick(e, '/')}>Главная</a>
          </Link>
        </li>
        <li className={isActive03 ? `active` : ''}>
          <Link href="/course_book" legacyBehavior>
            <a onClick={(e) => handleClick(e, '/course_book')}>Методичка</a>
          </Link>
        </li>
        <li className={isActive02 ? `active` : ''}>
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
