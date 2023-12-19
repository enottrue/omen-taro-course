import React from 'react';
import Button from '../button/Button';
import Image from 'next/image';
import Arrow from '@/images/svg/button-arrow.svg';
import { useState } from 'react';
import { useContext, useEffect } from 'react';
import { MainContext } from '@/contexts/MainContext';

const ModalRegister = () => {
  const cc = useContext(MainContext);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handlePhoneInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    const isValidPhoneNumber = /^[\d-+]+$/.test(value);

    if (isValidPhoneNumber || value === '') {
      setPhoneNumber(value);
    }
  };

  const [email, setEmail] = useState('');

  const handleEmailInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setEmail(value);
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

  const handleButtonClick = () => {
    if (!phoneNumber || phoneNumber.length < 5) {
      console.error('Phone is not present in the store or less than 5 symbols');
      setError('Не указан телефон или его длина менее 5 символов');
      return;
    }

    if (!name || name.length < 2) {
      console.error('Name is not present in the store or less than 2 symbols');
      setError('Не указано Имя или его длина менее 2 символов');

      return;
    }
    setError('');
    cc?.setSubmitting(true);

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
                onChange={(e) => {
                  setName(e.target.value);
                  console.log('a', name);
                }}
              />
            </label>

            <label className="custom-input">
              <input
                className="custom-input__element focus-within:border-sky-500 focus-within:border-1"
                placeholder="Номер телефона"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneInputChange}
              />
            </label>

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
              >
                <span className="modal__login-form-button-icon">
                  <Arrow />
                </span>
              </Button>
            </div>
          </div>

          <div className="modal__login-form-grid" id="step-2">
            <label className="custom-input">
              <input
                className="custom-input__element"
                placeholder="Город"
                type="text"
              />
            </label>

            <label className="custom-input">
              <input
                className="custom-input__element"
                placeholder="E-mail"
                type="email"
                value={email}
                onChange={(e) => {
                  const a = handleEmailInputChange(e);
                  console.log('a', a);
                }}
              />
            </label>

            <div className="modal__login-form-buttons">
              {/* <Button
                title="Пропустить"
                className="button_little button_ternary"
              /> */}
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegister;
