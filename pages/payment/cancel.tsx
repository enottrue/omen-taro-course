import React from 'react';
import { useRouter } from 'next/router';

const PaymentCancelPage: React.FC = () => {
  const router = useRouter();

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: '#f8d7da', 
        border: '1px solid #f5c6cb', 
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#721c24', marginBottom: '10px' }}>❌ Payment Cancelled</h1>
        <p style={{ color: '#721c24', fontSize: '18px' }}>
          Your payment was cancelled. No charges were made.
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6', 
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'left'
      }}>
        <h3>What happened?</h3>
        <ul>
          <li>You cancelled the payment process</li>
          <li>No money was charged to your account</li>
          <li>You can try again anytime</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => router.push('/stripe-test')}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Try Again
        </button>
        
        <button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelPage; 