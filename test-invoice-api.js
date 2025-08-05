const fetch = require('node-fetch');

// Конфигурация
const API_URL = 'http://localhost:3000/api/bitrix24/create-invoice';
const TEST_DATA = {
  email: 'test@example.com',
  dealId: 12345,
  productName: 'Cosmo Course',
  amount: 50, // $50.00
  currency: 'USD'
};

async function testInvoiceCreation() {
  console.log('🧪 Тестирование создания счета...');
  console.log('📋 Тестовые данные:', TEST_DATA);
  console.log('🌐 API URL:', API_URL);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_DATA)
    });
    
    const result = await response.json();
    console.log('📊 HTTP статус:', response.status);
    console.log('📊 Результат:', result);
    
    if (response.ok) {
      console.log('✅ Счет создан успешно!');
      console.log('📋 Invoice ID:', result.invoiceId);
      console.log('📋 Deal ID:', result.dealId);
    } else {
      console.error('❌ Ошибка создания счета:', result.error);
      if (result.details) {
        console.error('📋 Детали ошибки:', result.details);
      }
    }
  } catch (error) {
    console.error('❌ Ошибка запроса:', error.message);
  }
}

// Запуск теста
if (require.main === module) {
  testInvoiceCreation().catch(console.error);
}

module.exports = { testInvoiceCreation }; 