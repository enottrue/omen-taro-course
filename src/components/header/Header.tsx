import React, { useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/logo/Logo';
import Button from '@/components/button/Button';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import UseSubmit, { useSubmit } from '@/hooks/useSubmit';
import AuthNav from './AuthNav';

import cookie from 'cookie';

const Header = ({
  token,
  userId,
}: {
  token: string | null;
  userId: string | null;
}) => {
  const cc = useContext(MainContext);

  const { handleSubmit, loading, errorSubmit } = useSubmit({});

  useEffect(() => {
    if (cc?.menuOpen) {
      document.body.classList.add('menu-opened');
      document.body.classList.add('body-modal-open');

      cc?.setMenuOpen(true);
    } else {
      document.body.classList.remove('menu-opened');
      document.body.classList.remove('body-modal-open');
      cc?.setMenuOpen(false);
    }
  }, [cc?.menuOpen]);
  useEffect(() => {
    cc?.setToken(token);
    cc?.setUserId(userId);
  }, []);

  useEffect(() => {
    cc?.setToken(token);
    cc?.setUserId(userId);
  }, [token, userId]);

  return (
    <header className="header">
      <div className="header__wrapper">
        <Logo />

        <Button
          title="Задать вопрос"
          isLink={true}
          className="button_little button_secondary"
          attributes="button_little button_secondary"
          href="#"
          onClick={handleSubmit}
        >
          <span className="header__telegram-icon">
            <svg
              viewBox="0 0 32 32"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.122 10.040c0.006-0 0.014-0 0.022-0 0.209 0 0.403 0.065 0.562 0.177l-0.003-0.002c0.116 0.101 0.194 0.243 0.213 0.403l0 0.003c0.020 0.122 0.031 0.262 0.031 0.405 0 0.065-0.002 0.129-0.007 0.193l0-0.009c-0.225 2.369-1.201 8.114-1.697 10.766-0.21 1.123-0.623 1.499-1.023 1.535-0.869 0.081-1.529-0.574-2.371-1.126-1.318-0.865-2.063-1.403-3.342-2.246-1.479-0.973-0.52-1.51 0.322-2.384 0.221-0.23 4.052-3.715 4.127-4.031 0.004-0.019 0.006-0.040 0.006-0.062 0-0.078-0.029-0.149-0.076-0.203l0 0c-0.052-0.034-0.117-0.053-0.185-0.053-0.045 0-0.088 0.009-0.128 0.024l0.002-0.001q-0.198 0.045-6.316 4.174c-0.445 0.351-1.007 0.573-1.619 0.599l-0.006 0c-0.867-0.105-1.654-0.298-2.401-0.573l0.074 0.024c-0.938-0.306-1.683-0.467-1.619-0.985q0.051-0.404 1.114-0.827 6.548-2.853 8.733-3.761c1.607-0.853 3.47-1.555 5.429-2.010l0.157-0.031zM15.93 1.025c-8.302 0.020-15.025 6.755-15.025 15.060 0 8.317 6.742 15.060 15.060 15.060s15.060-6.742 15.060-15.060c0-8.305-6.723-15.040-15.023-15.060h-0.002q-0.035-0-0.070 0z"></path>
            </svg>
          </span>
        </Button>

        {!token ? (
          <Button
            title="Войти"
            className="button_little js-modal-open"
            data-modal="register"
            onClick={() => {
              cc?.setModalOpen(!cc?.modalOpen);
              cc?.setCurrentForm('signin');
            }}
          >
            <span className="header__icon">
              {/* SVG path goes here */}
              <svg fill="none" viewBox="0 0 24 24">
                <path
                  stroke="#FFF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M2 12h14m0 0-3.5-3m3.5 3-3.5 3"
                />
                <path
                  stroke="#FFF"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  d="M9 7c.01-2.18.11-3.35.88-4.12C10.76 2 12.18 2 15 2h1c2.83 0 4.24 0 5.12.88.88.88.88 2.3.88 5.12v8c0 2.83 0 4.24-.88 5.12-.88.88-2.3.88-5.12.88h-1c-2.83 0-4.24 0-5.12-.88C9.1 20.35 9 19.17 9 17"
                />
              </svg>
            </span>
          </Button>
        ) : (
          <Button
            title="Меню"
            className="button_little js-header__menu-toggle"
            onClick={() => {
              cc?.setMenuOpen(!cc?.menuOpen);
            }}
          >
            <span className="header__icon">
              <svg width="800" height="800" viewBox="0 0 20 20" fill="#FFF">
                <g id="Page-1" fillRule="evenodd" stroke="none" strokeWidth="1">
                  <g
                    id="Dribbble-Light-Preview"
                    transform="translate(-140 -2159)"
                  >
                    <g id="icons" transform="translate(56 160)">
                      <path
                        id="profile_round-[#1342]"
                        d="M100.56 2017H87.44c-.7 0-1.23-.7-.96-1.34 1.23-2.96 4.14-4.66 7.52-4.66s6.29 1.7 7.52 4.66c.27.64-.25 1.34-.96 1.34m-10.64-12c0-2.2 1.83-4 4.08-4s4.08 1.8 4.08 4-1.83 4-4.08 4a4.05 4.05 0 0 1-4.08-4m14.04 11.64a9.52 9.52 0 0 0-6.12-6.97 5.93 5.93 0 0 0 2.21-5.6 6.1 6.1 0 0 0-5.32-5.03 6.08 6.08 0 0 0-6.85 5.96c0 1.89.89 3.57 2.28 4.67a9.52 9.52 0 0 0-6.12 6.97c-.27 1.22.74 2.36 2.01 2.36h15.9c1.27 0 2.28-1.14 2-2.36"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </span>
          </Button>
        )}
      </div>
      {token && <AuthNav />}
    </header>
  );
};

export default Header;
