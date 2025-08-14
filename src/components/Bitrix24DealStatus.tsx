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
        <p>Сделка создана успешно</p>
        <small>ID сделки: {dealId}</small>
      </div>
    );
  }

  return (
    <div className="deal-status-info">
      {isLoading ? (
        <div className="deal-loading">
          <div className="spinner"></div>
          <p>Создание сделки в системе...</p>
        </div>
      ) : error ? (
        <div className="deal-error">
          <p>Ошибка создания сделки: {error}</p>
          {showCreateButton && (
            <button onClick={triggerDealCreation} className="retry-button">
              Попробовать снова
            </button>
          )}
        </div>
      ) : (
        <div className="deal-pending">
          <p>Ожидание создания сделки...</p>
          {showCreateButton && (
            <button onClick={triggerDealCreation} className="create-deal-button">
              Создать сделку
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Bitrix24DealStatus;
