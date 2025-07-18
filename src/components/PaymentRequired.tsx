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
      console.error('Payment processing error:', error);
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
          Access Restricted
        </h1>
        
        <p style={{
          color: '#2d3436',
          marginBottom: '2rem',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Payment is required to access this section. 
          After payment, you will receive full access to all materials.
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
            💳 Pay for Course
          </button>
        ) : (
          <div>
            <p style={{
              color: '#e17055',
              marginBottom: '1.5rem',
              fontSize: '1rem'
            }}>
              You need to sign in to make a payment
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
              🔐 Sign In
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
            What's included in the course:
          </h3>
          <ul style={{
            textAlign: 'left',
            color: '#0c5460',
            lineHeight: '1.5'
          }}>
            <li>Full access to all lessons</li>
            <li>Video materials and practical assignments</li>
            <li>Personal support</li>
            <li>Certificate upon course completion</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequired; 