import React from 'react';
import styles from './Button.module.css';

// Updated ButtonProps interface with loading support

export type ButtonVariant = 'primary' | 'secondary' | 'video' | 'enroll';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  icon,
  loading = false,
  loadingText = 'Loading...'
}) => {
  const buttonClass = [
    styles.button,
    styles[variant],
    className
  ].join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {icon && !loading && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
};

export default Button; 