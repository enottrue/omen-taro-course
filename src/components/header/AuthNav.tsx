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

  const cc = useContext(MainContext);
  return (
    <nav className="header__nav">
      <ul>
        <li>
          <Link href="#" legacyBehavior>
            <a>Личный кабинет</a>
          </Link>
        </li>
        <li className="active">
          <Link href="#" legacyBehavior>
            <a>Главная</a>
          </Link>
        </li>
        <li>
          <Link href="#" legacyBehavior>
            <a>Методичка</a>
          </Link>
        </li>
        <li>
          <Link href="#" legacyBehavior>
            <a>Обучающий курс</a>
          </Link>
        </li>
        <li>
          <Link href="#" legacyBehavior>
            <a>Магазин раскладов</a>
          </Link>
        </li>
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
