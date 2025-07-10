import React from 'react';

interface ButtonArrowRightProps {
  className?: string;
  width?: number;
  height?: number;
}

const ButtonArrowRight: React.FC<ButtonArrowRightProps> = ({ 
  className = '', 
  width = 16, 
  height = 16 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M6 12L10 8L6 4" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ButtonArrowRight; 