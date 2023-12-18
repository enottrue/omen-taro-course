import React from 'react';

interface ButtonProps {
  title?: string;
  href?: string;
  attributes?: string;
  className?: string;
  isLink?: boolean;
  children?: React.ReactNode;
  // attributes?: React.ButtonHTMLAttributes<HTMLButtonElement> &
  // React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  href = '#',
  isLink = false,
  children,
  className,
  attributes,
  ...rest
}) => {
  if (isLink) {
    return (
      <a href={href} className={`button ` + attributes}>
        {title && <span className="button__text">{title}</span>}
        {children && <span className="button__icon">{children}</span>}
      </a>
    );
  }

  return (
    <button className={`button ` + attributes}>
      {title && <span className="button__text">{title}</span>}
      {children && <span className="button__icon">{children}</span>}
    </button>
  );
};

export default Button;
