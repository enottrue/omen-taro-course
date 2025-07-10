import React, { useState } from 'react';
import { createDealOnRegistration } from '../src/utils/bitrix24';
import Head from 'next/head';

const Bitrix24TestPage: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testBitrix24Integration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Тестирование интеграции с Битрикс24...');
      
      const testData = {
        name: 'Тестовый Пользователь',
        email: `test${Date.now()}@example.com`,
        phone: '+7 (999) 123-45-67',
        city: 'Москва',
        productId: '1777',
        comments: 'Тестовая регистрация для проверки интеграции с Битрикс24',
      };

      console.log('📋 Тестовые данные:', testData);

      const bitrixResult = await createDealOnRegistration(testData);

      setResult({
        bitrixResult,
        testData,
        timestamp: new Date().toISOString(),
      });

      console.log('✅ Результат тестирования:', bitrixResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('❌ Ошибка тестирования:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Тест интеграции с Битрикс24</title>
      </Head>
      
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>🧪 Тест интеграции с Битрикс24</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={testBitrix24Integration}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Тестируем...' : 'Запустить тест'}
          </button>
        </div>

        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <h3>❌ Ошибка:</h3>
            <pre>{error}</pre>
          </div>
        )}

        {result && (
          <div style={{
            padding: '15px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <h3>✅ Результат тестирования:</h3>
            <div style={{ marginBottom: '10px' }}>
              <strong>Время:</strong> {result.timestamp}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Успех:</strong> {result.bitrixResult.success ? '✅ Да' : '❌ Нет'}
            </div>
            {result.bitrixResult.success && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <strong>ID сделки:</strong> {result.bitrixResult.dealId}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>ID контакта:</strong> {result.bitrixResult.contactId}
                </div>
                {result.bitrixResult.productName && (
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Продукт:</strong> {result.bitrixResult.productName}
                  </div>
                )}
                {result.bitrixResult.productPrice && (
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Цена:</strong> ${result.bitrixResult.productPrice}
                  </div>
                )}
              </>
            )}
            {result.bitrixResult.error && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Ошибка:</strong> {result.bitrixResult.error}
              </div>
            )}
            
            <details style={{ marginTop: '15px' }}>
              <summary>📋 Детали запроса</summary>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '5px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <div style={{
          padding: '15px',
          backgroundColor: '#e2e3e5',
          color: '#383d41',
          border: '1px solid #d6d8db',
          borderRadius: '5px'
        }}>
          <h3>📋 Инструкция:</h3>
          <ol>
            <li>Нажмите кнопку "Запустить тест"</li>
            <li>Проверьте консоль браузера для детальных логов</li>
            <li>Убедитесь, что сделка создана в Битрикс24</li>
            <li>Если есть ошибки, проверьте настройки webhook URL</li>
          </ol>
          
          <h4>🔧 Проверьте настройки:</h4>
          <ul>
            <li>BITRIX24_WEBHOOK_URL в переменных окружения</li>
            <li>Права доступа webhook в Битрикс24</li>
            <li>ID ответственного менеджера</li>
            <li>ID категории сделок</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Bitrix24TestPage; 