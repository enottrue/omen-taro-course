import React from 'react';
import InvoiceTest from '../src/components/InvoiceTest';

const TestInvoicePage: React.FC = () => {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🧪 Тестирование создания счетов в Bitrix24</h1>
      
      <div style={{ 
        backgroundColor: '#d4edda', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #c3e6cb',
        color: '#155724'
      }}>
        <h3>✅ Проблема решена!</h3>
        <p>Поле <strong>UF_CRM_1628621924030</strong> теперь заполняется правильным значением <strong>1013</strong>.</p>
        <p><strong>Webhook URL:</strong> https://crm.taroirena.com/rest/1/62s3v3dkougs3qsm/</p>
        <p><strong>Entity Type ID:</strong> 31 (смарт-процесс для счетов)</p>
        <p><strong>Product ID:</strong> 1777 (Compass)</p>
      </div>

      <InvoiceTest 
        dealId={12345} 
        email="test@example.com" 
      />

      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px'
      }}>
        <h3>📝 Логи</h3>
        <p>Откройте консоль браузера (F12) для просмотра подробных логов создания счета.</p>
        <p>Логи также будут доступны в консоли сервера Next.js.</p>
      </div>

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px'
      }}>
        <h3>🔧 API Endpoints</h3>
        <ul>
          <li><strong>POST /api/bitrix24/create-invoice</strong> - Создание счета</li>
          <li><strong>POST /api/bitrix24/create-deal</strong> - Создание сделки</li>
          <li><strong>POST /api/stripe/create-checkout-session-with-invoice</strong> - Создание Stripe сессии с счетом</li>
        </ul>
      </div>
    </div>
  );
};

export default TestInvoicePage; 