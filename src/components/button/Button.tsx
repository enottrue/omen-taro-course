import { type } from 'os';
import React from 'react';
import Link from 'next/link';

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
  download?: boolean;
  target?: string;
  // attributes?: React.ButtonHTMLAttributes<HTMLButtonElement> &
  // React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  href = '#',
  isLink = false,
  children,
  onClick,
  download,
  target,
  disabled,
  type,
  className,
  attributes,
  ...rest
}) => {
  if (isLink) {
    return (
      <Link
        href={href}
        className={`button ` + attributes + ' ' + className}
        download={download}
        onClick={onClick}
        target={target}
      >
        {title && <span className="button__text">{title}</span>}
        {children && <span className="button__icon">{children}</span>}
      </Link>
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
