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
import { useGetUserData } from '@/hooks/useGetUserData';
import { useLazyQuery } from '@apollo/client';
import { GET_USER } from '@/graphql/queries';
import { useMetrica } from 'next-yandex-metrica';

const ModalRegister = () => {
  const router = useRouter();
  const { reachGoal } = useMetrica();

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
    const re = /^[a-zA-Zа-яА-Я\s-]+$/;
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
    console.log('[Register] Start registration');
    if (!email || !validateEmail()) {
      console.error('[Register] Invalid email');
      setError('Please enter a valid email address');
      cc?.setSubmitting(false);
      return;
    }
    if (!password || password.length < 4) {
      console.error('[Register] Password too short');
      setError('Password must be at least 4 characters long');
      cc?.setSubmitting(false);
      return;
    }

    if (!phoneNumber || phoneNumber.length < 5) {
      console.error('[Register] Phone number too short');
      setError('Phone number is required and must be at least 5 characters long');
      cc?.setSubmitting(false);
      return;
    }

    if (!name || name.length < 2) {
      console.error('[Register] Name too short');
      setError('Name is required and must be at least 2 characters long');
      cc?.setSubmitting(false);
      return;
    }
    setError('');
    cc?.setSubmitting(true);

    console.log('[Register] Submitting registration form', { name, email, phoneNumber, password, city });
    const registerUser = await handleSubmit({
      name,
      email,
      phone: phoneNumber,
      password,
      city,
    });
    console.log('[Register] Registration result:', registerUser);
    if (registerUser?.error == 'true') {
      setError(registerUser?.message);
      cc?.setSubmitting(false);
      console.error('[Register] Registration error:', registerUser?.message);
      return;
    }
    reachGoal('form_register');
    cc?.setSubmitting(false);

    // Сохраняем токен и пользователя в куки и контекст
    Cookies.set('Bearer', registerUser?.token, { expires: 180 });
    Cookies.set('userId', registerUser?.user?.id, { expires: 180 });
    cc?.setToken(registerUser?.token);
    cc?.setUserId(registerUser?.user?.id);
    cc?.setUser(registerUser?.user);
    console.log('[Register] Auth cookies and context set', {
      token: registerUser?.token,
      userId: registerUser?.user?.id,
      user: registerUser?.user
    });

    // Stripe redirect logic
    try {
      console.log('[Register] Requesting Stripe checkout session for', registerUser?.user?.email);
      const stripeRes = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registerUser?.user?.email }),
    });
      const stripeData = await stripeRes.json();
      console.log('[Register] Stripe response:', stripeData);
      if (stripeRes.ok && stripeData.sessionId) {
        console.log('[Register] Redirecting to Stripe payment page...');
        window.location.href = `/payment/success?session_id=${stripeData.sessionId}`;
        return; // ВАЖНО: остановить выполнение дальше!
      } else {
        setError('Failed to initiate payment. Please try again.');
        console.error('[Register] Stripe error:', stripeData);
      }
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      console.error('[Register] Stripe fetch error:', err);
    }
    // --- НЕ ДЕЛАТЬ router.push, cc?.setModalOpen, cc?.setCurrentForm и т.д. ---
  };

  return (
    <div className={cc?.modalOpen ? 'modal active' : 'modal'} id="register">
      <div className="modal__backing" />
      <div className="modal__content modal__content_small">
        <div className="modal__title">Fill out the registration form</div>
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
            <label className="custom-input" id="name">
              <input
                className="custom-input__element  focus-within:border-sky-500 focus-within:border-1"
                placeholder="Full Name"
                type="text"
                autoComplete="name"
                name="name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </label>
            <label className="custom-input" id="password">
              <input
                className="custom-input__element  focus-within:border-sky-500 focus-within:border-1"
                placeholder="Password"
                type="password"
                autoComplete="new-password"
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </label>

            <label className="custom-input" id="email">
              <input
                className="custom-input__element focus-within:border-sky-500 focus-within:border-1"
                placeholder="E-mail"
                type="email"
                autoComplete="email"
                name="email"
                value={email}
                onChange={(e) => {
                  const a = handleEmailInputChange(e);
                }}
              />
            </label>

            <label className="custom-input" id="phone">
              <input
                className="custom-input__element focus-within:border-sky-500 focus-within:border-1"
                placeholder="Phone number"
                type="tel"
                autoComplete="tel"
                name="phone"
                value={phoneNumber}
                onChange={handlePhoneInputChange}
              />
            </label>
          </div>

          <div className="modal__login-form-grid active" id="step-2">
            <label className="custom-input">
              <input
                className="custom-input__element focus-within:border-sky-500 focus-within:border-1"
                placeholder="City"
                autoComplete="address-level2"
                name="city"
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
                title="Next"
                type="button"
                className="button_little button_secondary"
                // onClick={() => window.activateStep2()}
                onClick={handleButtonClick}
                aria-label="Next"
                aria-disabled={cc?.submitting}
                disabled={cc?.submitting}
              >
                <span className="modal__login-form-button-icon">
                  {/* Inline SVG for arrow icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 10H15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 5L15 10L10 15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
