import React from 'react';
import Button from '@/components/button/Button';
import ButtonArrowRight from '@/images/svg/ButtonArrowRight';

interface OnboardingButtonProps {
  type: 'skip' | 'next' | 'finish';
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
}

const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  type,
  onClick,
  disabled = false,
  loading = false
}) => {
  const getButtonConfig = () => {
    switch (type) {
      case 'skip':
        return {
          title: 'Пропустить',
          className: 'button_ternary',
          showIcon: false
        };
      case 'next':
        return {
          title: 'Далее',
          className: 'js-onboarding-next',
          showIcon: true
        };
      case 'finish':
        return {
          title: 'Перейти к обучению',
          className: 'js-onboarding-next',
          showIcon: true
        };
      default:
        return {
          title: '',
          className: '',
          showIcon: false
        };
    }
  };

  const config = getButtonConfig();
  const isDisabled = disabled || loading;
  const buttonClassName = `${config.className}${loading ? ' loading' : ''}`;

  return (
    <Button
      title={config.title}
      className={buttonClassName}
      onClick={onClick}
      disabled={isDisabled}
    >
      {config.showIcon && !loading && (
        <span className="onboarding__button-icon">
          <ButtonArrowRight />
        </span>
      )}
    </Button>
  );
};

export default OnboardingButton; 