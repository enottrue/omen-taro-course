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

  useEffect(() => {
    if (cc?.modalOpen) {
      document.body.classList.add('body-modal-open');
      cc?.setModalOpen(true);
    } else {
      document.body.classList.remove('body-modal-open');
      cc?.setModalOpen(false);
    }
  }, [cc?.modalOpen]);

  const handlePhoneInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    const isValidPhoneNumber = /^[\d-+]+$/.test(value);

    if (isValidPhoneNumber || value === '') {
      setPhoneNumber(value);
    }
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
          }}
        />

        <form className="modal__login-form" action="">
          <div className="modal__login-form-grid active" id="step-1">
            <label className="custom-input">
              <input
                className="custom-input__element  focus-within:border-sky-500 focus-within:border-1"
                placeholder="Фамилия Имя"
                type="text"
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

            <div className="modal__login-form-button">
              <Button
                title="Далее"
                type="button"
                className="button_little button_secondary"
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
              />
            </label>

            <div className="modal__login-form-buttons">
              <Button
                title="Пропустить"
                className="button_little button_ternary"
              />
              <Button title="Далее" className="button_little button_secondary">
                <span className="modal__login-form-button-icon">
                  <Image
                    src="/svg/button-arrow.svg"
                    alt="Button Arrow"
                    width={20}
                    height={20}
                  />{' '}
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

export default ModalRegister;
