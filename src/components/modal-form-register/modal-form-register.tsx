import type { NextPage } from "next";
import React, { useState, useEffect, useContext } from 'react';
import styles from './modal-form-register.module.css';
import CloseIcon from '@/images/svg/close.svg';
import { MainContext } from '@/contexts/MainContext';
import useSubmit from '@/hooks/useSubmit';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import useGetUserData from '@/hooks/useGetUserData';
import { useLazyQuery } from '@apollo/client';
import { GET_USER } from '@/graphql/queries';
import { useMetrica } from 'next-yandex-metrica';

export type ModalFormRegisterType = {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

const ModalFormRegister: NextPage<ModalFormRegisterType> = ({ 
  className = "", 
  isOpen = false, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const { handleSubmit, loading, errorSubmit } = useSubmit({});
  const cc = useContext(MainContext);
  const router = useRouter();
  const { reachGoal } = useMetrica();
  const [getUser, { loading: loadingLazy, data, error: errorLazy }] = useLazyQuery(GET_USER);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handlePhoneInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isValidPhoneNumber = /^[\d-+()]+$/.test(value);
    if (isValidPhoneNumber || value === '') {
      setPhone(value);
    }
  };

  const handleEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handleCityInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const re = /^[a-zA-Zа-яА-Я\s-]+$/;
    const isValid = re.test(value);
    if (isValid || value === '') {
      setCity(value);
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = re.test(email);
    if (!isValid) return false;
    const domain = email.split('@')[1];
    const domainName = domain.split('.')[0];
    const domainExtension = domain.split('.')[1];
    if (domainName.length === 0 || domainExtension.length < 2) return false;
    return true;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    cc?.setSubmitting && cc.setSubmitting(true);
    
    if (!fullName || fullName.length < 2) {
      setError('Не указано Имя или его длина менее 2 символов');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!email || !validateEmail(email)) {
      setError('Укажите корректный email');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!phone || phone.length < 5) {
      setError('Не указан телефон или его длина менее 5 символов');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!password || password.length < 4) {
      setError('Укажите пароль не менее 4 символов');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!city || city.trim().length < 2) {
      setError('Укажите город');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    try {
      const registerUser = await handleSubmit({
        name: fullName,
        email,
        phone,
        password,
        city,
      });

      if (registerUser?.error === 'true') {
        setError(registerUser?.message);
        cc?.setSubmitting && cc.setSubmitting(false);
        return;
      }

      reachGoal('form_register');
      cc?.setSubmitting && cc.setSubmitting(false);

      const onboarding = localStorage.getItem('onboarded');
      !onboarding && localStorage.setItem('onboarded', 'false');
      const shouldRedirect = onboarding === 'true' ? '/courses' : '/onboarding';
      
      Cookies.set('Bearer', registerUser?.token, { expires: 180 });
      Cookies.set('userId', registerUser?.user?.id, { expires: 180 });
      cc?.setToken && cc.setToken(registerUser?.token);
      cc?.setUserId && cc.setUserId(registerUser?.user?.id);
      
      handleClose();
      cc?.setCurrentForm && cc.setCurrentForm(null);
      
      const userData = await getUser({
        variables: { id: registerUser?.user?.id },
      });
      cc?.setUser && cc.setUser(userData?.data?.getUser);
      
      router.push(shouldRedirect);
    } catch (err) {
      setError((err as Error).message);
      cc?.setSubmitting && cc.setSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={[styles['modal-form'], className].join(" ")} 
      onClick={handleBackdropClick}
    >
      <div className={styles['modal-content']}>
        <button 
          className={styles['modal-close']} 
          type="button"
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
        <h3 className={styles['modal-title']}>fill out</h3>
        <h2 className={styles['modal-title-ru']}>
          регис-<br />
          трация
        </h2>
        <form className={styles['modal-fields']} onSubmit={handleSubmitForm}>
          <input
            type="text"
            placeholder="Фамилия Имя*"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="E-mail*"
            required
            value={email}
            onChange={handleEmailInputChange}
            autoComplete="email"
          />
          <input
            type="tel"
            placeholder="Номер телефона*"
            required
            value={phone}
            onChange={handlePhoneInputChange}
            autoComplete="tel"
          />
          <input
            type="password"
            placeholder="Пароль*"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <input
            type="text"
            placeholder="Город*"
            required
            value={city}
            onChange={handleCityInputChange}
            autoComplete="address-level2"
          />
          {error && <div className={styles['modal-error']}>{error}</div>}
          <button className={styles['modal-submit']} type="submit" disabled={loading || cc?.submitting}>
            {loading || cc?.submitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalFormRegister;