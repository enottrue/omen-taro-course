import Button from '@/components/button/Button';
import Logo from '../logo/Logo';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Header() {
  const router = useRouter();
  const isActive01 = router.asPath === '/';
  const isActive02 = router.asPath === '/course';
  const isActive03 = router.asPath === '/course_book';

  return (
    <header className="header">
      <div className="header__wrapper">
        <Logo /> {/* Замените на ваш компонент Logo */}
        <Button
          title="Задать вопрос"
          isLink={true}
          href="#"
          className="button_little button_secondary"
        >
          <span className="header__telegram-icon">
            {/* Вставьте ваш SVG */}
          </span>
        </Button>
        <Button title="Меню" className="button_little js-header__menu-toggle">
          <span className="header__icon">{/* Вставьте ваш SVG */}</span>
        </Button>
        <nav className="header__nav">
          <ul>
            {/* <li>
              <a href="#">Личный кабинет</a>
            </li> */}
            <li>
              <Link className="active" legacyBehavior href={'/'}>
                <a>Главная</a>
              </Link>
            </li>
            <li>
              <a href="#">Методичка</a>
            </li>
            <li>
              <a href="#">Обучающий курс</a>
            </li>
            {/* <li>
              <a href="#">Магазин раскладов</a>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
