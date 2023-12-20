import React from 'react';
import Link from 'next/link';

const AuthNav: React.FC = () => {
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
    </nav>
  );
};

export default AuthNav;
