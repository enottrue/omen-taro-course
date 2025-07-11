import React, { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { useStripePayment } from '@/hooks/useStripePayment';

const PaymentRequired: React.FC = () => {
  const context = useContext(MainContext);
  const { handlePayment, isAuthenticated } = useStripePayment();

  const handlePaymentClick = async () => {
    try {
      await handlePayment();
    } catch (error) {
      console.error('Ошибка при обработке оплаты:', error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        maxWidth: '600px',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid #ff6b6b'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          🔒
        </div>
        
        <h1 style={{
          color: '#d63031',
          marginBottom: '1.5rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Доступ ограничен
        </h1>
        
        <p style={{
          color: '#2d3436',
          marginBottom: '2rem',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Для доступа к этому разделу необходимо произвести оплату курса. 
          После оплаты вы получите полный доступ ко всем материалам.
        </p>
        
        {isAuthenticated ? (
          <button
            onClick={handlePaymentClick}
            style={{
              padding: '15px 30px',
              backgroundColor: '#00b894',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#00a085';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#00b894';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            💳 Оплатить курс
          </button>
        ) : (
          <div>
            <p style={{
              color: '#e17055',
              marginBottom: '1.5rem',
              fontSize: '1rem'
            }}>
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
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              🔐 Войти в систему
            </button>
          </div>
        )}
        
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#e8f4fd',
          borderRadius: '10px',
          border: '1px solid #bee5eb'
        }}>
          <h3 style={{
            color: '#0c5460',
            marginBottom: '0.5rem',
            fontSize: '1.1rem'
          }}>
            Что включено в курс:
          </h3>
          <ul style={{
            textAlign: 'left',
            color: '#0c5460',
            lineHeight: '1.5'
          }}>
            <li>Полный доступ ко всем урокам</li>
            <li>Видео материалы и практические задания</li>
            <li>Персональная поддержка</li>
            <li>Сертификат по окончании курса</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequired; 