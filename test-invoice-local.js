// Локальный тест создания счета в Bitrix24
const CORRECT_WEBHOOK_URL = 'https://crm.taroirena.com/rest/1/62s3v3dkougs3qsm/';

async function testInvoiceCreation() {
  console.log('🚀 Тестируем создание счета в Bitrix24...\n');
  
  const dealId = 86085;
  const amount = 50;
  const currency = 'USD';
  
  console.log('📋 Параметры теста:', { dealId, amount, currency });
  
  try {
    // 1. Сначала проверим подключение
    console.log('1️⃣ Проверяем подключение к Bitrix24...');
    const connectionResponse = await fetch(`${CORRECT_WEBHOOK_URL}user.current`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (connectionResponse.ok) {
      console.log('✅ Подключение работает');
    } else {
      console.log('❌ Проблема с подключением');
      return;
    }
    
    // 2. Проверим существование сделки
    console.log('\n2️⃣ Проверяем существование сделки...');
    const dealResponse = await fetch(`${CORRECT_WEBHOOK_URL}crm.deal.get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ id: dealId.toString() })
    });
    
    if (dealResponse.ok) {
      const dealInfo = await dealResponse.json();
      console.log('✅ Сделка найдена:', dealInfo.result?.TITLE);
    } else {
      console.log('❌ Сделка не найдена');
      return;
    }
    
    // 3. Тестируем создание счета с правильной структурой полей
    console.log('\n3️⃣ Тестируем создание счета с правильной структурой полей...');
    const invoiceData1 = {
      'entityTypeId': '31',
      'fields[title]': `Invoice for Astrology Reading - Test User`,
      'fields[stageId]': 'NEW',
      'fields[assignedById]': '1',
      'fields[contactId]': '1',
      'fields[opportunity]': amount.toString(),
      'fields[currencyId]': 'USD',
      'fields[parentId2]': dealId.toString(),
      'fields[ufCrm_SMART_INVOICE_1706948587230]': '1013',
      'fields[ufCrm_67AE0664BC8E9]': '939',
      'fields[mycompanyId]': '51',
      'fields[COMMENTS]': `Astrology Reading Service\nClient: Test User\nEmail: test@example.com\nPhone: +1234567890\nPrice: ${amount} USD`
    };
    
    const invoiceResponse1 = await fetch(`${CORRECT_WEBHOOK_URL}crm.item.add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(invoiceData1)
    });
    
    const result1 = await invoiceResponse1.json();
    console.log('📊 Результат (минимальные поля):', result1);
    
    if (result1.result) {
      console.log('✅ Счет создан успешно с минимальными полями!');
      console.log('📄 ID счета:', result1.result);
      
      // 4. Добавляем товар Compass к счету
      console.log('\n4️⃣ Добавляем товар Compass к счету...');
      const invoiceId = result1.result.item.id; // Правильный ID счета
      
      // Сначала найдем товар Compass
      console.log('🔍 Ищем товар Compass...');
      const productResponse = await fetch(`${CORRECT_WEBHOOK_URL}crm.product.list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'filter[NAME]': 'Compass'
        })
      });
      
      const productResult = await productResponse.json();
      console.log('📊 Результат поиска товара:', productResult);
      
      if (productResult.result && productResult.result.length > 0) {
        const compassProduct = productResult.result[0];
        console.log('✅ Товар Compass найден:', compassProduct.ID);
        
        // Добавляем товар к счету через смарт-процесс
        const addProductData = {
          'entityTypeId': '31',
          'id': invoiceId.toString(),
          'fields[PRODUCT_NAME]': 'Compass',
          'fields[PRICE]': amount.toString(),
          'fields[QUANTITY]': '1',
          'fields[PRODUCT_ID]': compassProduct.ID.toString(),
        };
        
        console.log('📋 Данные для добавления товара:', addProductData);
        
        const addProductResponse = await fetch(`${CORRECT_WEBHOOK_URL}crm.item.update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(addProductData)
        });
        
        const addProductResult = await addProductResponse.json();
        console.log('📊 Результат добавления товара:', addProductResult);
        
        if (addProductResult.result) {
          console.log('✅ Товар Compass успешно добавлен к счету!');
        } else {
          console.log('❌ Ошибка добавления товара:', addProductResult.error_description);
        }
      } else {
        console.log('❌ Товар Compass не найден');
      }
      
      return;
    }
    
    // 5. Если не получилось, пробуем с другими полями
    console.log('\n5️⃣ Пробуем с альтернативными полями...');
    const invoiceData2 = {
      'entityTypeId': '31',
      'fields[title]': `Invoice for Astrology Reading - Test User`,
      'fields[stageId]': 'NEW',
      'fields[assignedById]': '1',
      'fields[contactId]': '1',
      'fields[opportunity]': amount.toString(),
      'fields[currencyId]': 'USD',
      'fields[parentId2]': dealId.toString(),
      'fields[mycompanyId]': '51',
      'fields[COMMENTS]': `Astrology Reading Service\nClient: Test User\nEmail: test@example.com\nPhone: +1234567890\nPrice: ${amount} USD`
    };
    
    const invoiceResponse2 = await fetch(`${CORRECT_WEBHOOK_URL}crm.item.add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(invoiceData2)
    });
    
    const result2 = await invoiceResponse2.json();
    console.log('📊 Результат (альтернативные поля):', result2);
    
    if (result2.result) {
      console.log('✅ Счет создан успешно с альтернативными полями!');
      console.log('📄 ID счета:', result2.result);
      return;
    }
    
    console.log('\n❌ Все методы не сработали. Проверьте логи выше.');
    
  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

// Запускаем тест
testInvoiceCreation(); 