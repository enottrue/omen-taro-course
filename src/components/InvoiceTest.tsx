import React, { useState } from 'react';

interface InvoiceTestProps {
  dealId?: number;
  email?: string;
}

const InvoiceTest: React.FC<InvoiceTestProps> = ({ dealId = 12345, email = 'test@example.com' }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/bitrix24/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          dealId,
          productName: 'Cosmo Course',
          amount: 50, // $50.00
          currency: 'USD'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        console.log('✅ Invoice created successfully:', data);
      } else {
        setError(data.error || 'Failed to create invoice');
        console.error('❌ Error creating invoice:', data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Error creating invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px 0',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🧪 Тест создания счета в Bitrix24</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <p><strong>Deal ID:</strong> {dealId}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Amount:</strong> $50.00 USD</p>
        <p><strong>Product:</strong> Cosmo Course</p>
      </div>

      <button
        onClick={createInvoice}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px'
        }}
      >
        {loading ? '🔄 Создание счета...' : '💰 Создать счет'}
      </button>

      {error && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb', 
          borderRadius: '4px',
          color: '#721c24'
        }}>
          <strong>❌ Ошибка:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb', 
          borderRadius: '4px',
          color: '#155724'
        }}>
          <strong>✅ Успешно!</strong>
          <pre style={{ marginTop: '10px', fontSize: '12px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default InvoiceTest; 