import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#00b894',
  className = ''
}) => {
  const sizeMap = {
    small: '16px',
    medium: '20px',
    large: '24px'
  };

  return (
    <div 
      className={`loading-spinner ${className}`}
      style={{
        display: 'inline-block',
        width: sizeMap[size],
        height: sizeMap[size],
        border: `2px solid rgba(0, 184, 148, 0.2)`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '8px'
      }}
    />
  );
};

export default LoadingSpinner;
