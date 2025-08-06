import { NextApiRequest, NextApiResponse } from 'next';

// Конфигурация
const WEBHOOK_URL = 'https://crm.taroirena.com/rest/1/62s3v3dkougs3qsm/';

// Функция для создания счета в Bitrix24
async function createInvoiceInBitrix24(dealId: number, amount: number, currency: string = 'USD', email: string, productName: string = 'Cosmo Course'): Promise<{
  success: boolean;
  invoiceId?: number;
  error?: string;
}> {
  console.log('💰 Создание счета в Bitrix24...');
  console.log('📋 Данные счета:', { dealId, amount, currency, email, productName });

  try {
    // Сначала проверяем существование сделки
    try {
      const dealResponse = await fetch(`${WEBHOOK_URL}crm.deal.get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ id: dealId.toString() })
      });
      
      if (dealResponse.ok) {
        const dealInfo = await dealResponse.json();
        if (dealInfo.result) {
          console.log('✅ Сделка найдена:', dealInfo.result.TITLE);
        } else {
          console.error('❌ Сделка не найдена');
          return {
            success: false,
            error: `Deal with ID ${dealId} not found`,
          };
        }
      } else {
        console.error('❌ Ошибка получения информации о сделке');
        return {
          success: false,
          error: `Deal with ID ${dealId} not accessible`,
        };
      }
    } catch (dealError) {
      console.error('❌ Ошибка получения информации о сделке:', dealError);
      return {
        success: false,
        error: `Deal with ID ${dealId} not accessible`,
      };
    }
    
    // Создаем счет через смарт-процесс
    const invoiceData = {
      'entityTypeId': '31', // ID типа смарт-процесса для счетов
      'fields[title]': `Invoice for ${productName} - ${email}`,
      'fields[stageId]': 'NEW',
      'fields[assignedById]': '1',
      'fields[contactId]': '1',
      'fields[opportunity]': amount.toString(),
      'fields[currencyId]': currency,
      'fields[parentId2]': dealId.toString(), // Привязка к сделке
      'fields[mycompanyId]': '51',
      'fields[sourceId]': 'UC_HZ10CI',
      'fields[ufCrm_SMART_INVOICE_1706948587230]': '1013',
      'fields[COMMENTS]': `${productName} Service\nClient: ${email}\nEmail: ${email}\nPrice: ${amount} ${currency}`
    };
    
    console.log('📋 Данные для создания счета:', invoiceData);

    const response = await fetch(`${WEBHOOK_URL}crm.item.add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(invoiceData)
    });

    const result = await response.json();

    if (result.result) {
      console.log('✅ Счет создан успешно:', result.result);
      
      // Извлекаем ID из правильной структуры ответа
      let invoiceId;
      if (result.result.item && result.result.item.id) {
        // Структура для смарт-процессов
        invoiceId = result.result.item.id;
      } else if (typeof result.result === 'number') {
        // Структура для обычных счетов
        invoiceId = result.result;
      } else {
        console.error('❌ Неожиданная структура ответа:', result.result);
        return {
          success: false,
          error: 'Unexpected response structure from Bitrix24',
        };
      }
      
      return {
        success: true,
        invoiceId: invoiceId,
      };
    } else {
      console.error('❌ Ошибка создания счета:', result.error_description);
      
      // Попробуем альтернативный подход - создание через обычный API счетов
      console.log('🔄 Пробуем альтернативный метод создания счета...');
      
      try {
        const alternativeInvoiceData = {
          'fields[title]': `Invoice for ${productName} - ${email}`,
          'fields[stageId]': 'NEW',
          'fields[assignedById]': '1',
          'fields[contactId]': '1',
          'fields[opportunity]': amount.toString(),
          'fields[currencyId]': currency,
          'fields[parentId2]': dealId.toString(),
          'fields[mycompanyId]': '51',
          'fields[COMMENTS]': `${productName} Service\nClient: ${email}\nEmail: ${email}\nPrice: ${amount} ${currency}`
        };
        
        const altResponse = await fetch(`${WEBHOOK_URL}crm.invoice.add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(alternativeInvoiceData)
        });
        
        const altResult = await altResponse.json();
        
        if (altResult.result) {
          console.log('✅ Счет создан через альтернативный метод:', altResult.result);
          return {
            success: true,
            invoiceId: altResult.result,
          };
        } else {
          console.error('❌ Ошибка альтернативного создания счета:', altResult.error_description);
          return {
            success: false,
            error: `Failed to create invoice: ${result.error_description || 'Unknown error'}`,
          };
        }
      } catch (altError) {
        console.error('❌ Ошибка альтернативного метода:', altError);
        return {
          success: false,
          error: `Failed to create invoice: ${result.error_description || 'Unknown error'}`,
        };
      }
    }
  } catch (error) {
    console.error('❌ Ошибка создания счета:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Функция для добавления товара к счету
async function addProductToInvoice(invoiceId: number, productName: string, price: number): Promise<boolean> {
  console.log('📦 Добавление товара к счету...');
  console.log('📋 Данные товара:', { invoiceId, productName, price });

  try {
    // Используем правильный метод для добавления товаров к смарт-процессу
    const addProductData = {
      'entityTypeId': '31', // ID типа смарт-процесса для счетов
      'id': invoiceId.toString(),
      'fields[productRows][0][productId]': '1777', // ID товара Compass
      'fields[productRows][0][price]': price.toString(),
      'fields[productRows][0][quantity]': '1',
      'fields[productRows][0][sort]': '10'
    };
    
    console.log('📋 Данные для добавления товара:', addProductData);
    
    const addProductResponse = await fetch(`${WEBHOOK_URL}crm.item.update`, {
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
      return true;
    } else {
      console.log('❌ Ошибка добавления товара:', addProductResult.error_description);
      
      // Попробуем альтернативный метод через обычный API счетов
      console.log('🔄 Пробуем альтернативный метод добавления товара...');
      
      try {
        const altProductData = {
          'id': invoiceId.toString(),
          'fields[productRows][0][productId]': '1777',
          'fields[productRows][0][price]': price.toString(),
          'fields[productRows][0][quantity]': '1',
          'fields[productRows][0][sort]': '10'
        };
        
        const altResponse = await fetch(`${WEBHOOK_URL}crm.invoice.update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(altProductData)
        });
        
        const altResult = await altResponse.json();
        
        if (altResult.result) {
          console.log('✅ Товар добавлен через альтернативный метод');
          return true;
        } else {
          console.log('❌ Ошибка альтернативного добавления товара:', altResult.error_description);
          return false;
        }
      } catch (altError) {
        console.error('❌ Ошибка альтернативного метода добавления товара:', altError);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Ошибка добавления товара:', error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('🚀 API endpoint для создания счета вызван:', req.url);
  console.log('📅 Время:', new Date().toISOString());
  console.log('📋 Request method:', req.method);
  
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      email, 
      dealId, 
      productName = 'Cosmo Course',
      amount = 50, // $50.00
      currency = 'USD'
    } = req.body;
    
    console.log('📧 Received data:', { email, dealId, productName, amount, currency });

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!dealId) {
      return res.status(400).json({ error: 'Deal ID is required' });
    }

    console.log('💰 Creating invoice in Bitrix24...');
    console.log('📋 Параметры для создания счета:', {
      dealId,
      amount,
      currency
    });
    
    // Создаем счет в Битрикс24
    const invoiceResult = await createInvoiceInBitrix24(dealId, amount, currency, email, productName);
    
    console.log('📊 Результат создания счета:', invoiceResult);
    
    if (!invoiceResult.success) {
      console.error('❌ Failed to create invoice:', invoiceResult.error);
      return res.status(500).json({ 
        error: 'Failed to create invoice in Bitrix24',
        details: {
          invoiceError: invoiceResult.error,
          webhookUrl: WEBHOOK_URL
        }
      });
    }

    const invoiceId = invoiceResult.invoiceId;
    if (!invoiceId) {
      console.error('❌ Invoice ID is undefined');
      return res.status(500).json({ error: 'Invoice ID is undefined' });
    }
    
    console.log('✅ Invoice created successfully:', invoiceId);

    // Добавляем товар Compass к счету
    console.log('📦 Adding Compass product to invoice...');
    const productAdded = await addProductToInvoice(invoiceId, 'Compass', amount);
    
    if (!productAdded) {
      console.warn('⚠️ Failed to add product to invoice, but continuing...');
    }

    console.log('✅ Invoice creation completed successfully');
    
    res.status(200).json({ 
      success: true,
      invoiceId: invoiceId,
      dealId: dealId,
      message: 'Invoice created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating invoice:', error);
    res.status(500).json({ error: 'Error creating invoice' });
  }
} 