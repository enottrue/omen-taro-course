import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    if (router.query.session_id) {
      setSessionId(router.query.session_id as string);
    }
  }, [router.query]);

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: '#d4edda', 
        border: '1px solid #c3e6cb', 
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#155724', marginBottom: '10px' }}>✅ Payment Successful!</h1>
        <p style={{ color: '#155724', fontSize: '18px' }}>
          Thank you for purchasing the Cosmo Course!
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6', 
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'left'
      }}>
        <h3>What's Next?</h3>
        <ul>
          <li>You will receive an email confirmation shortly</li>
          <li>Access to the course will be available immediately</li>
          <li>Check your email for login credentials</li>
        </ul>

        {sessionId && (
          <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
            <strong>Session ID:</strong> {sessionId}
          </div>
        )}
      </div>

      <button
        onClick={() => router.push('/')}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Return to Home
      </button>
    </div>
  );
};

export default PaymentSuccessPage; 