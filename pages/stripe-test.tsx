import React, { useState } from 'react';
import { createCheckoutSession, redirectToCheckout } from '../src/utils/stripeCheckout';

const StripeTestPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sessionId = await createCheckoutSession(email);
      await redirectToCheckout(sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Stripe Payment Test</h1>
      <p>Test the Stripe payment integration for Cosmo Course ($50)</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
          Email:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Processing...' : 'Pay $50 for Cosmo Course'}
      </button>

      {error && (
        <div style={{ 
          color: 'red', 
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#ffe6e6',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Test Instructions:</h3>
        <ul>
          <li>Enter your email address</li>
          <li>Click "Pay $50 for Cosmo Course"</li>
          <li>You'll be redirected to Stripe Checkout</li>
          <li>Use test card: 4242 4242 4242 4242</li>
          <li>Any future expiry date</li>
          <li>Any 3-digit CVC</li>
        </ul>
      </div>
    </div>
  );
};

export default StripeTestPage; 