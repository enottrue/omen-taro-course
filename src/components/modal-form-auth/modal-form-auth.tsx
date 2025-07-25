import type { NextPage } from "next";
import React, { useState, useEffect, useContext } from 'react';
import styles from './modal-form-auth.module.scss';
import Image from 'next/image';
import closeIcon from '@/images/svg/close.svg';
import { MainContext } from '@/contexts/MainContext';
import useLogin from '@/hooks/useLogin';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { getOnboardingRedirectPath, getOnboardingStatus } from '@/utils/onboardingUtils';

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
      setError('Please enter a valid email');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters');
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
          aria-label="Close"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="16" cy="16" r="16" fill="#001a4d"/>
            <path d="M10 10L22 22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M22 10L10 22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h3 className={styles['modal-title']}>Sign in</h3>
        <h2 className={styles['modal-title-ru']}>
          to access<br />
          the course:
        </h2>
        <form className={styles['modal-fields']} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail*"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            name="email"
          />
          <input
            type="password"
            placeholder="Password*"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            name="password"
          />
          <a 
            href="#"
            className={styles['modal-link-forgot']}
            onClick={(e) => {
              e.preventDefault();
              handleClose();
              cc?.setCurrentForm && cc.setCurrentForm('forgot-password');
            }}
          >
            Forgot password?
          </a>
          {error && <div className={styles['modal-error']}>{
            error === 'Please enter a valid email' ? 'Please enter a valid email' :
            error === 'Password must be at least 4 characters' ? 'Password must be at least 4 characters' :
            error
          }</div>}
          <button className={styles['modal-submit']} type="submit" disabled={loading || cc?.submitting}>
            {loading || cc?.submitting ? 'Signing in...' : 'Sign In'}
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
            No account? Register
          </a>
        </form>
      </div>
    </div>
  );
};

export default ModalFormAuth;