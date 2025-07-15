import type { NextPage } from "next";
import React, { useState, useEffect, useContext } from 'react';
import styles from './modal-form-register.module.css';
import CloseIcon from '@/images/svg/close.svg';
import { MainContext } from '@/contexts/MainContext';
import useSubmit from '@/hooks/useSubmit';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useLazyQuery } from '@apollo/client';
import { GET_USER } from '@/graphql/queries';
import { useMetrica } from 'next-yandex-metrica';
import { createCheckoutSession, redirectToCheckout } from '@/utils/stripeCheckout';

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
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { handleSubmit, loading } = useSubmit({});
  const cc = useContext(MainContext);
  const router = useRouter();
  const { reachGoal } = useMetrica();
  const [getUser, { loading: loadingLazy, data, error: errorLazy }] = useLazyQuery(GET_USER);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
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

  const handleEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
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
      setError('Name is required and must be at least 2 characters long');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long');
      cc?.setSubmitting && cc.setSubmitting(false);
      return;
    }
    
    try {
      const registerUser = await handleSubmit({
        name: fullName,
        email,
        password,
      });

      if (registerUser?.error === 'true') {
        setError(registerUser?.message);
        cc?.setSubmitting && cc.setSubmitting(false);
        return;
      }

      reachGoal('form_register');
      cc?.setSubmitting && cc.setSubmitting(false);

      // Set cookies and context for the newly registered user
      Cookies.set('Bearer', registerUser?.token, { expires: 180 });
      Cookies.set('userId', registerUser?.user?.id, { expires: 180 });
      cc?.setToken && cc.setToken(registerUser?.token);
      cc?.setUserId && cc.setUserId(registerUser?.user?.id);
      
      // Get user data and update context
      const userData = await getUser({
        variables: { id: registerUser?.user?.id },
      });
      cc?.setUser && cc.setUser(userData?.data?.getUser);
      
      // Close modal
      handleClose();
      cc?.setCurrentForm && cc.setCurrentForm(null);
      
      console.log('✅ User registered successfully, redirecting to Stripe checkout...');
      
      // Redirect to Stripe checkout for payment
      try {
        console.log('🔄 Creating Stripe checkout session for email:', email);
        const sessionId = await createCheckoutSession(email);
        console.log('✅ Stripe session created:', sessionId);
        console.log('🔄 Redirecting to Stripe checkout...');
        await redirectToCheckout(sessionId);
      } catch (stripeError) {
        console.error('❌ Stripe checkout error:', stripeError);
        // If Stripe fails, fallback to homepage
        console.log('⚠️ Stripe checkout failed, redirecting to homepage');
        router.push('/');
      }
      
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
        <h3 className={styles['modal-title']}>fill out</h3>
        <h2 className={styles['modal-title-ru']}>
          Registration
        </h2>
        <form className={styles['modal-fields']} onSubmit={handleSubmitForm}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            autoComplete="name"
            name="name"
          />
          <input
            type="email"
            placeholder="E-mail*"
            required
            value={email}
            onChange={handleEmailInputChange}
            autoComplete="email"
            name="email"
          />
          <input
            type="password"
            placeholder="Password*"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            name="password"
          />
          {error && <div className={styles['modal-error']}>{error}</div>}
          <button className={styles['modal-submit']} type="submit" disabled={loading || cc?.submitting}>
            {loading || cc?.submitting ? 'Registering...' : 'Register'}
          </button>
          <a 
            href="#"
            className={styles['modal-link-simple']}
            onClick={(e) => {
              e.preventDefault();
              handleClose();
              cc?.setCurrentForm && cc.setCurrentForm('auth');
            }}
          >
            Already have an account?
          </a>
        </form>
      </div>
    </div>
  );
};

export default ModalFormRegister;