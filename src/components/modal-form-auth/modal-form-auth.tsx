import type { NextPage } from "next";
import React, { useState, useEffect, useContext } from 'react';
import styles from './modal-form-auth.module.css';
import CloseIcon from '@/images/svg/close.svg';
import { MainContext } from '@/contexts/MainContext';
import useLogin from '@/hooks/useLogin';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export type ModalFormAuthType = {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

const ModalFormAuth: NextPage<ModalFormAuthType> = ({ 
  className = "", 
  isOpen = false, 
  onClose 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useLogin();
  const cc = useContext(MainContext);
  const router = useRouter();

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    onClose?.();
    cc?.setCurrentForm && cc.setCurrentForm(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    cc?.setSubmitting && cc.setSubmitting(true);
    
    if (!email || !validateEmail(email)) {
      setError('Укажите корректный email');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!password || password.length < 4) {
      setError('Укажите пароль не менее 4 символов');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    try {
      const userData = await login(email, password);
      if (userData.error) {
        setError(userData.message);
        cc?.setSubmitting && cc.setSubmitting(false);
        return;
      }
      cc?.setToken && cc.setToken(userData.token);
      cc?.setUserId && cc.setUserId(userData.user.id);
      cc?.setUser && cc.setUser(userData.user);
      Cookies.set('Bearer', userData?.token, { expires: 180 });
      Cookies.set('userId', userData?.user?.id, { expires: 180 });
      cc?.setSubmitting && cc.setSubmitting(false);
      handleClose();
      cc?.setCurrentForm && cc.setCurrentForm(null);
      let onboarding = localStorage.getItem('onboarded');
      if (!onboarding) {
        localStorage.setItem('onboarded', 'false');
        onboarding = 'false';
      }
      const shouldRedirect = onboarding === 'true' ? '/courses' : '/onboarding';
      router.push(shouldRedirect);
    } catch (err) {
      setError((err as Error).message);
      cc?.setSubmitting && cc.setSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
          автори-<br />
          зация
        </h2>
        <form className={styles['modal-fields']} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail*"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password*"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <div className={styles['modal-error']}>{error}</div>}
          <button className={styles['modal-submit']} type="submit" disabled={loading || cc?.submitting}>
            {loading || cc?.submitting ? 'Вход...' : 'Войти'}
          </button>
          <a 
            href="#"
            className={styles['modal-link-simple']}
            onClick={(e) => {
              e.preventDefault();
              handleClose();
              cc?.setCurrentForm && cc.setCurrentForm('register');
            }}
          >
            Нет аккаунта? Зарегистрироваться
          </a>
        </form>
      </div>
    </div>
  );
};

export default ModalFormAuth;