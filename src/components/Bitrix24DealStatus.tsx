import React from 'react';
import { useBitrix24DealStatus } from '@/hooks/useBitrix24DealStatus';

interface Bitrix24DealStatusProps {
  userId: string | null;
  initialDealId?: number | null;
  showCreateButton?: boolean;
  onDealCreated?: () => void;
}

const Bitrix24DealStatus: React.FC<Bitrix24DealStatusProps> = ({
  userId,
  initialDealId,
  showCreateButton = true,
  onDealCreated,
}) => {
  const {
    isLoading,
    dealId,
    contactId,
    isDealCreated,
    error,
    checkDealStatus,
    triggerDealCreation,
  } = useBitrix24DealStatus({ userId, initialDealId });

  // Вызываем callback когда сделка создана
  React.useEffect(() => {
    if (isDealCreated && onDealCreated) {
      onDealCreated();
    }
  }, [isDealCreated, onDealCreated]);

  if (!userId) {
    return null;
  }

  if (isDealCreated) {
    return (
      <div className="deal-status-success">
        <div className="success-icon">✅</div>
        <p>Deal created successfully</p>
        <small>Deal ID: {dealId}</small>
      </div>
    );
  }

  return (
    <div className="deal-status-info">
      {isLoading ? (
        <div className="deal-loading">
          <div className="spinner"></div>
          <p>creating registration in system...</p>
        </div>
      ) : error ? (
        <div className="deal-error">
          <p>error creating registration: {error}</p>
          {showCreateButton && (
            <button onClick={triggerDealCreation} className="retry-button">
              Try again
            </button>
          )}
        </div>
      ) : (
        <div className="deal-pending">
          <p>wait processing registration...</p>
          {/* {showCreateButton && (
            <button onClick={triggerDealCreation} className="create-deal-button">
              finish registration
            </button>
          )} */}
        </div>
      )}
    </div>
  );
};

export default Bitrix24DealStatus;
