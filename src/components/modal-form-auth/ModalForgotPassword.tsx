import type { NextPage } from "next";
import React, { useState, useEffect, useContext } from 'react';
import styles from './modal-form-auth.module.css';
import CloseIcon from '@/images/svg/close.svg';
import { MainContext } from '@/contexts/MainContext';
import { gql } from 'graphql-request';
import { request } from 'graphql-request';

export type ModalForgotPasswordType = {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      message
      error
    }
  }
`;

const ModalForgotPassword: NextPage<ModalForgotPasswordType> = ({ 
  className = "", 
  isOpen = false, 
  onClose 
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const cc = useContext(MainContext);

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
    setSuccess('');
    setLoading(true);
    
    if (!email || !validateEmail(email)) {
      setError('Укажите корректный email');
      setLoading(false);
      return;
    }
    
    try {
      const response = await request('/api/graphql', FORGOT_PASSWORD_MUTATION, {
        email
      }) as any;

      if (response.forgotPassword.error) {
        setError(response.forgotPassword.message);
      } else {
        setSuccess(response.forgotPassword.message);
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте еще раз.');
    } finally {
      setLoading(false);
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
        <h3 className={styles['modal-title']}>Восстановление</h3>
        <h2 className={styles['modal-title-ru']}>
          пароля
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
          {error && <div className={styles['modal-error']}>{error}</div>}
          {success && <div className={styles['modal-success']}>{success}</div>}
          <button className={styles['modal-submit']} type="submit" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить'}
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
            Вернуться к входу
          </a>
        </form>
      </div>
    </div>
  );
};

export default ModalForgotPassword; 