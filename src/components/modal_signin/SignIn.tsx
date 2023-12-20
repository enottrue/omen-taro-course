import React from 'react';
import Button from '../button/Button';
import Image from 'next/image';
import Arrow from '@/images/svg/button-arrow.svg';
import { useState } from 'react';
import { useContext, useEffect } from 'react';
import { MainContext } from '@/contexts/MainContext';
import useLogin from '@/hooks/useLogin';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const ModalSignIn = () => {
  const router = useRouter();
  const cc = useContext(MainContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const { login, loading, error: LoginError } = useLogin();

  useEffect(() => {
    if (cc?.modalOpen) {
      document.body.classList.add('body-modal-open');
      cc?.setModalOpen(true);
    } else {
      document.body.classList.remove('body-modal-open');
      cc?.setModalOpen(false);
    }
  }, [cc?.modalOpen]);

  const handleSubmitClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const validateEmail = () => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValid = re.test(email);

      if (!isValid) {
        return false;
      }

      // Check if the domain name after the . is valid
      const domain = email.split('@')[1];
      const domainName = domain.split('.')[0];
      const domainExtension = domain.split('.')[1];

      if (domainName.length === 0 || domainExtension.length < 2) {
        return false;
      }

      return true;
    };
    cc?.setSubmitting(true);
    if (!email || !validateEmail()) {
      console.error('Укажите корректный email');
      setError('Укажите корректный email');
      cc?.setSubmitting(false);
      return;
    }

    if (!password || password.length < 4) {
      console.error('Укажите пароль не менее 4 символов');
      setError('Укажите пароль не менее 4 символов');
      cc?.setSubmitting(false);
      return;
    }
    setError('');

    try {
      const userData = await login(email, password);
      console.log('userData', userData);
      if (userData.error) {
        setError(userData.message);
        cc?.setSubmitting(false);
        return;
      }
      cc?.setToken(userData.token);
      cc?.setUserId(userData.user.id);
      Cookies.set('Bearer', userData?.token, { expires: 180 });
      Cookies.set('userId', userData?.user?.id, { expires: 180 });
      cc?.setSubmitting(false);
      const onboarding = localStorage.getItem('onboarded');
      !onboarding && localStorage.setItem('onboarded', 'false');
      const shouldRedirect = onboarding === 'true' ? '/courses' : '/onboarding';
      router.push(shouldRedirect);
    } catch (err) {
      setError((err as Error).message);
    }

    console.log('Done');
    cc?.setSubmitting(false);

    // If phone and name are present in the store and meet the length requirements, activate step 2
    // window.activateStep2();
  };

  return (
    <div className={cc?.modalOpen ? 'modal active' : 'modal'} id="register">
      <div className="modal__backing" />
      <div className="modal__content modal__content_small">
        <div className="modal__title">Заполните данные для авторизации</div>
        <button
          className="modal__close"
          type="button"
          onClick={() => {
            cc?.setModalOpen(!cc?.modalOpen);
            cc?.setCurrentForm(null);
          }}
        />

        <form className="modal__login-form" action="">
          <div className="modal__login-form-grid active" id="step-1">
            <label className="custom-input">
              <input
                className="custom-input__element  focus-within:border-sky-500 focus-within:border-1"
                placeholder="Email"
                required
                autoComplete="email"
                type="text"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </label>

            <label className="custom-input">
              <input
                className="custom-input__element focus-within:border-sky-500 focus-within:border-1"
                placeholder="Пароль"
                type="password"
                //autocomplete "current-password"
                autoComplete="current-password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                // value={phoneNumber}
                // onChange={handlePhoneInputChange}
              />
            </label>
            {error && (
              <div className="modal__login-form-button">
                <p>{error}</p>
              </div>
            )}

            <div className="modal__login-form-button">
              <Button
                title="Войти"
                type="button"
                className="button_little button_secondary"
                onClick={(e) => {
                  handleSubmitClick(e);
                }}
                aria-label="Войти"
                aria-disabled={cc?.submitting}
                disabled={cc?.submitting}
                // onClick={() => window.activateStep2()}
              >
                <span className="modal__login-form-button-icon">
                  {/* <Image
                  src="/svg/button-arrow.svg"
                  alt="Button Arrow"
                  width={20}
                  height={20}
                />{' '} */}
                  <Arrow />
                  {/* Adjust width and height as per your needs */}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSignIn;
