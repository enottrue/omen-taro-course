import React from 'react';
import Button from '../button/Button';
import Image from 'next/image';
import Arrow from '@/images/svg/button-arrow.svg';
import { useState } from 'react';
import { useContext, useEffect } from 'react';
import { MainContext } from '@/contexts/MainContext';
import useSubmit from '@/hooks/useSubmit';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import useGetUserData from '@/hooks/useGetUserData';
import { useLazyQuery } from '@apollo/client';
import { GET_USER } from '@/graphql/queries';

const ModalRegister = () => {
  const router = useRouter();
  const [getUser, { loading: loadingLazy, data, error: errorLazy }] =
    useLazyQuery(GET_USER);

  const cc = useContext(MainContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const { handleSubmit, loading, errorSubmit } = useSubmit({});

  const handlePhoneInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    const isValidPhoneNumber = /^[\d-+()]+$/.test(value);

    if (isValidPhoneNumber || value === '') {
      setPhoneNumber(value);
    }
  };

  const handleEmailInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handleCityInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    const re = /^[a-zA-Z\s-]+$/;
    const isValid = re.test(value);
    if (isValid || value === '') {
      setCity(value);
    }
  };

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

  const handleButtonClick = async () => {
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

    if (!phoneNumber || phoneNumber.length < 5) {
      console.error('Phone is not present in the store or less than 5 symbols');
      setError('Не указан телефон или его длина менее 5 символов');
      cc?.setSubmitting(false);

      return;
    }

    if (!name || name.length < 2) {
      console.error('Name is not present in the store or less than 2 symbols');
      setError('Не указано Имя или его длина менее 2 символов');
      cc?.setSubmitting(false);

      return;
    }
    setError('');
    cc?.setSubmitting(true);

    const registerUser = await handleSubmit({
      name,
      email,
      phone: phoneNumber,
      password,
      city,
    });
    console.log('c', registerUser);
    if (registerUser?.error == 'true') {
      setError(registerUser?.message);
      cc?.setSubmitting(false);
      return;
    }

    cc?.setSubmitting(false);

    const onboarding = localStorage.getItem('onboarded');
    !onboarding && localStorage.setItem('onboarded', 'false');
    const shouldRedirect = onboarding === 'true' ? '/courses' : '/onboarding';
    Cookies.set('Bearer', registerUser?.token, { expires: 180 });
    Cookies.set('userId', registerUser?.user?.id, { expires: 180 });
    cc?.setToken(registerUser?.token);
    cc?.setUserId(registerUser?.user?.id);
    cc?.setModalOpen(!cc?.modalOpen);
    cc?.setCurrentForm(null);
    const userData = await getUser({
      variables: { id: registerUser?.user?.id },
    });
    cc?.setUser(userData?.data?.getUser);
    router.push(shouldRedirect);
  };

  return (
    <div className={cc?.modalOpen ? 'modal active' : 'modal'} id="register">
      <div className="modal__backing" />
      <div className="modal__content modal__content_small">
        <div className="modal__title">Заполните данные для регистрации</div>
        <button
          className="modal__close"
          type="button"
          onClick={() => {
            cc?.setModalOpen(!cc?.modalOpen);
            cc?.setCurrentForm(null);
            cc?.setSubmitting(false);
          }}
        />

        <form className="modal__login-form" action="">
          <div className="modal__login-form-grid active" id="step-1">
            <label className="custom-input">
              <input
                className="custom-input__element  focus-within:border-sky-500 focus-within:border-1"
                placeholder="Фамилия Имя"
                type="text"
                autoComplete="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </label>
            <label className="custom-input">
              <input
                className="custom-input__element  focus-within:border-sky-500 focus-within:border-1"
                placeholder="Пароль"
                type="password"
                autoComplete="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </label>

            <label className="custom-input">
              <input
                className="custom-input__element focus-within:border-sky-500 focus-within:border-1"
                placeholder="E-mail"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  const a = handleEmailInputChange(e);
                }}
              />
            </label>

            <label className="custom-input">
              <input
                className="custom-input__element focus-within:border-sky-500 focus-within:border-1"
                placeholder="Номер телефона"
                type="tel"
                autoComplete="phone"
                value={phoneNumber}
                onChange={handlePhoneInputChange}
              />
            </label>
          </div>

          <div className="modal__login-form-grid active" id="step-2">
            <label className="custom-input">
              <input
                className="custom-input__element focus-within:border-sky-500 focus-within:border-1"
                placeholder="Город"
                autoComplete="city"
                type="text"
                value={city}
                onChange={handleCityInputChange}
              />
            </label>

            {/* <div className="modal__login-form-buttons">
              <Button
                title="Пропустить"
                className="button_little button_ternary"
              />
              <Button
                title="Далее"
                className="button_little button_secondary"
                onClick={validateEmail}
              >
                <span className="modal__login-form-button-icon">
                  <Image
                    src="/svg/button-arrow.svg"
                    alt="Button Arrow"
                    width={20}
                    height={20}
                  />{' '}
                </span>
              </Button>
            </div> */}
            {error && (
              <div className="modal__login-form-button">
                <p>{error}</p>
              </div>
            )}
            <div className="modal__login-form-button">
              <Button
                title="Далее"
                type="button"
                className="button_little button_secondary"
                // onClick={() => window.activateStep2()}
                onClick={handleButtonClick}
                aria-label="Далее"
                aria-disabled={cc?.submitting}
                disabled={cc?.submitting}
              >
                <span className="modal__login-form-button-icon">
                  <Arrow />
                </span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegister;
