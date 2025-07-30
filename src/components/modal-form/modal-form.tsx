import type { NextPage } from "next";
import React, { useState, useEffect, useContext } from 'react';
import styles from './modal-form.module.css';
import CloseIcon from '@/images/svg/close.svg';
import { MainContext } from '@/contexts/MainContext';
import useLogin from '@/hooks/useLogin';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { getOnboardingRedirectPath, getOnboardingStatus } from '@/utils/onboardingUtils';

export type ModalFormType = {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

const ModalForm: NextPage<ModalFormType> = ({ 
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
  const { login, loading } = useLogin();
  const cc = useContext(MainContext);
  const router = useRouter();

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

  const validatePhone = (phone: string) => {
    // Убираем все нецифровые символы для проверки
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10;
  };

  const validateFullName = (name: string) => {
    // Проверяем, что имя содержит минимум 2 слова (фамилия и имя)
    const words = name.trim().split(/\s+/);
    return words.length >= 2 && words.every(word => word.length >= 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    cc?.setSubmitting && cc.setSubmitting(true);
    
    if (!fullName || !validateFullName(fullName)) {
      setError('Please provide your Last Name and First Name (minimum 2 words)');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!phone || !validatePhone(phone)) {
      setError('Please enter a valid phone number');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!password || password.length < 4) {
      setError('Please enter a password of at least 4 characters');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!city || city.trim().length < 2) {
      setError('Specify the city');
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
      const onboardingStatus = getOnboardingStatus();
      const shouldRedirect = getOnboardingRedirectPath(onboardingStatus === 'true');
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
        <h3 className={styles['modal-title']}>Sign in</h3>
        <h2 className={styles['modal-title-ru']}>
          to access <br />
          the course:
        </h2>
        <form className={styles['modal-fields']} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name Last Name*"
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
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="tel"
            placeholder="Phone number*"
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            autoComplete="tel"
          />
          <input
            type="password"
            placeholder="Password*"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <input
            type="text"
            placeholder="City*"
            required
            value={city}
            onChange={e => setCity(e.target.value)}
            autoComplete="address-level2"
          />
          {error && <div className={styles['modal-error']}>{error}</div>}
          <button className={styles['modal-submit']} type="submit" disabled={loading || cc?.submitting}>
            {loading || cc?.submitting ? 'Registration...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;