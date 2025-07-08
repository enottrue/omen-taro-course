import React, { useState } from 'react';

interface PaymentStatusProps {
  userId: number;
  isPaid: boolean;
  onStatusChange?: (isPaid: boolean) => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  userId, 
  isPaid, 
  onStatusChange 
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(isPaid);

  const handleStatusChange = async (newStatus: boolean) => {
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