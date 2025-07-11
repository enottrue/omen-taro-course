import React, { useState, useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { useStripePayment } from '@/hooks/useStripePayment';

interface PaymentStatusProps {
  userId?: number;
  isPaid?: boolean;
  onStatusChange?: (isPaid: boolean) => void;
  showPaymentButton?: boolean;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  userId, 
  isPaid, 
  onStatusChange,
  showPaymentButton = false
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(isPaid);
  const context = useContext(MainContext);
  const { handlePayment, isAuthenticated } = useStripePayment();

  const handleStatusChange = async (newStatus: boolean) => {
    if (!userId) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/users/update-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          isPaid: newStatus,
        }),
      });

      if (response.ok) {
        setStatus(newStatus);
        onStatusChange?.(newStatus);
        console.log(`Статус оплаты обновлен: ${newStatus ? 'Оплачено' : 'Не оплачено'}`);
      } else {
        console.error('Ошибка обновления статуса оплаты');
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса оплаты:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = async () => {
    try {
      await handlePayment();
    } catch (error) {
      console.error('Ошибка при обработке оплаты:', error);
    }
  };

  // Если это компонент для отображения статуса оплаты на главной странице
  if (showPaymentButton && !isPaid) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '2px solid #ff6b6b', 
        borderRadius: '10px',
        margin: '20px 0',
        backgroundColor: '#fff5f5',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#d63031', marginBottom: '15px' }}>
          🔒 Доступ к курсу ограничен
        </h3>
        <p style={{ marginBottom: '20px', color: '#2d3436' }}>
          Для получения доступа к курсу необходимо произвести оплату.
        </p>
        
        {isAuthenticated ? (
          <button
            onClick={handlePaymentClick}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#bdc3c7' : '#00b894',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Обработка...' : '💳 Оплатить курс'}
          </button>
        ) : (
          <div>
            <p style={{ marginBottom: '15px', color: '#e17055' }}>
              Для оплаты необходимо войти в систему
            </p>
            <button
              onClick={() => {
                context?.setModalOpen(true);
                context?.setCurrentForm('auth');
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#0984e3',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              🔐 Войти в систему
            </button>
          </div>
        )}
      </div>
    );
  }

  // Административный интерфейс для управления статусом оплаты
  return (
    <div style={{ 
      padding: '10px', 
      border: '1px solid #ddd', 
      borderRadius: '5px',
      margin: '10px 0'
    }}>
      <h4>Статус оплаты</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span>Пользователь ID: {userId}</span>
        <span style={{ 
          color: status ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {status ? 'Оплачено' : 'Не оплачено'}
        </span>
        <button
          onClick={() => handleStatusChange(!status)}
          disabled={loading}
          style={{
            padding: '5px 10px',
            backgroundColor: loading ? '#ccc' : status ? '#ff4444' : '#44ff44',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Обновление...' : status ? 'Отменить оплату' : 'Отметить как оплачено'}
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus; 