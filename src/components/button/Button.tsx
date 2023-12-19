import { type } from 'os';
import React from 'react';

interface ButtonProps {
  title?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  attributes?: string;
  className?: string;
  onClick?: (e: any) => void;
  isLink?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  // attributes?: React.ButtonHTMLAttributes<HTMLButtonElement> &
  // React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  href = '#',
  isLink = false,
  children,
  onClick,
  disabled,
  type,
  className,
  attributes,
  ...rest
}) => {
  if (isLink) {
    return (
      <a
        href={href}
        className={`button ` + attributes + ' ' + className}
        onClick={onClick}
      >
        {title && <span className="button__text">{title}</span>}
        {children && <span className="button__icon">{children}</span>}
      </a>
    );
  }

  return (
    <button
      className={`button ` + className}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {title && <span className="button__text">{title}</span>}
      {children && <span className="button__icon">{children}</span>}
    </button>
  );
};

export default Button;
