import React, { useState } from 'react';
import { createDealOnRegistration, getUtmDataFromCookies } from '../utils/bitrix24';
import { getUtmForBitrix24 } from '../utils/utmUtils';
import PaymentStatus from './PaymentStatus';
import UserInfo from './UserInfo';

const Bitrix24Test: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testBitrix24Integration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const utmData = getUtmForBitrix24();
      const cookiesUtmData = getUtmDataFromCookies();

      const testData = {
        name: 'Тестовый Пользователь',
        email: 'test@example.com',
        phone: '+7 (999) 123-45-67',
        city: 'Москва',
        productId: '1777',
        comments: 'Тестовая регистрация для проверки интеграции с Битрикс24',
        utmData,
      };

      const bitrixResult = await createDealOnRegistration(testData);

      setResult({
        bitrixResult,
        utmData,
        cookiesUtmData,
        testData,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Тест интеграции с Битрикс24</h2>
      
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
          marginBottom: '20px'
        }}
      >
        {loading ? 'Тестирование...' : 'Запустить тест'}
      </button>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6',
          borderRadius: '5px'
        }}>
          <h3>Результат теста:</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <h4>Результат Битрикс24:</h4>
            <pre style={{ 
              backgroundColor: '#e9ecef', 
              padding: '10px', 
              borderRadius: '3px',
              overflow: 'auto'
            }}>
              {JSON.stringify(result.bitrixResult, null, 2)}
            </pre>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h4>UTM данные из утилиты:</h4>
            <pre style={{ 
              backgroundColor: '#e9ecef', 
              padding: '10px', 
              borderRadius: '3px',
              overflow: 'auto'
            }}>
              {JSON.stringify(result.utmData, null, 2)}
            </pre>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h4>UTM данные из cookies:</h4>
            <pre style={{ 
              backgroundColor: '#e9ecef', 
              padding: '10px', 
              borderRadius: '3px',
              overflow: 'auto'
            }}>
              {JSON.stringify(result.cookiesUtmData, null, 2)}
            </pre>
          </div>

          <div>
            <h4>Тестовые данные:</h4>
            <pre style={{ 
              backgroundColor: '#e9ecef', 
              padding: '10px', 
              borderRadius: '3px',
              overflow: 'auto'
            }}>
              {JSON.stringify(result.testData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e7f3ff', 
        border: '1px solid #b3d9ff',
        borderRadius: '5px'
      }}>
        <h4>Инструкция:</h4>
        <ul>
          <li>Нажмите кнопку "Запустить тест" для проверки интеграции</li>
          <li>Проверьте результат в консоли браузера</li>
          <li>Убедитесь, что сделка создана в Битрикс24</li>
          <li>Проверьте, что UTM метки переданы корректно</li>
        </ul>
      </div>

      {/* Информация о пользователе */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#d1ecf1', 
        border: '1px solid #bee5eb',
        borderRadius: '5px'
      }}>
        <h3>Информация о пользователе</h3>
        <UserInfo userId={1} />
      </div>

      {/* Секция управления статусом оплаты */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7',
        borderRadius: '5px'
      }}>
        <h3>Управление статусом оплаты</h3>
        <p>Тестовый пользователь с ID 1:</p>
        <PaymentStatus 
          userId={1} 
          isPaid={false} 
          onStatusChange={(isPaid) => {
            console.log(`Статус оплаты изменен на: ${isPaid ? 'Оплачено' : 'Не оплачено'}`);
          }}
        />
      </div>
    </div>
  );
};

export default Bitrix24Test; 