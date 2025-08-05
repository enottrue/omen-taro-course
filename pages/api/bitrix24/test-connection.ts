import { NextApiRequest, NextApiResponse } from 'next';
import { testBitrix24Connection, createInvoice } from '../../../src/utils/bitrix24';

// Временное решение - используем правильный URL напрямую
const CORRECT_WEBHOOK_URL = 'https://crm.taroirena.com/rest/1/62s3v3dkougs3qsm/';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Testing Bitrix24 connection...');
    console.log('📋 Using correct webhook URL:', CORRECT_WEBHOOK_URL);
    
    // Тестируем подключение с правильным URL
    const connectionTest = await testBitrix24ConnectionWithCorrectUrl();
    
    if (!connectionTest.success) {
      return res.status(500).json({
        error: 'Bitrix24 connection failed',
        details: connectionTest
      });
    }
    
    // Если есть dealId в query параметрах, тестируем создание счета
    const { dealId, amount = 50, currency = 'USD' } = req.query;
    
    if (dealId) {
      console.log('💰 Testing invoice creation...');
      const invoiceTest = await createInvoiceWithCorrectUrl(
        parseInt(dealId as string), 
        parseFloat(amount as string), 
        currency as string
      );
      
      return res.status(200).json({
        connection: connectionTest,
        invoiceTest
      });
    }
    
    return res.status(200).json({
      connection: connectionTest,
      message: 'Add ?dealId=123&amount=50&currency=USD to test invoice creation'
    });
    
  } catch (error) {
    console.error('❌ Error testing Bitrix24:', error);
    res.status(500).json({ 
      error: 'Error testing Bitrix24 connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Временные функции с правильным URL
async function testBitrix24ConnectionWithCorrectUrl() {
  console.log('🔍 Тестирование подключения к Битрикс24...');
  
  try {
    console.log('📋 Конфигурация:', {
      webhookUrl: CORRECT_WEBHOOK_URL,
      assignedById: 30902
    });
    
    // Тестируем простой запрос - получение информации о текущем пользователе
    const response = await fetch(`${CORRECT_WEBHOOK_URL}user.current`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Подключение к Битрикс24 успешно');
      return {
        success: true,
        webhookUrl: CORRECT_WEBHOOK_URL,
        assignedById: 30902
      };
    } else {
      const errorText = await response.text();
      console.error('❌ Ошибка подключения к Битрикс24:', errorText);
      return {
        success: false,
        error: errorText,
        webhookUrl: CORRECT_WEBHOOK_URL,
        assignedById: 30902
      };
    }
  } catch (error) {
    console.error('❌ Ошибка тестирования подключения:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      webhookUrl: CORRECT_WEBHOOK_URL,
      assignedById: 30902
    };
  }
}

async function createInvoiceWithCorrectUrl(dealId: number, amount: number, currency: string = 'RUB') {
  console.log('💰 Создание счета в Битрикс24 (смарт-процесс)...');
  console.log('📋 Данные счета:', { dealId, amount, currency });

  try {
    console.log('🔧 Конфигурация Битрикс24:', {
      webhookUrl: CORRECT_WEBHOOK_URL,
      assignedById: 30902
    });
    
    // Сначала попробуем получить информацию о сделке для проверки
    try {
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
        console.error('❌ Ошибка получения информации о сделке');
        return {
          success: false,
          error: `Deal with ID ${dealId} not found or inaccessible`,
        };
      }
    } catch (dealError) {
      console.error('❌ Ошибка получения информации о сделке:', dealError);
      return {
        success: false,
        error: `Deal with ID ${dealId} not found or inaccessible`,
      };
    }
    
    // Данные для создания счета как смарт-процесса
    const invoiceData = {
      'entityTypeId': '31', // ID типа смарт-процесса для счетов
      'fields[TITLE]': `Счет по сделке #${dealId}`,
      'fields[DEAL_ID]': dealId.toString(),
      'fields[CURRENCY]': currency,
      'fields[STATUS_ID]': 'NEW', // Новый статус
      'fields[ASSIGNED_BY_ID]': '30902',
      'fields[ACCOUNT_NUMBER]': `INV-${Date.now()}`, // Уникальный номер счета
      'fields[COMMENTS]': 'Счет создан автоматически при формировании ссылки на оплату',
      'fields[AMOUNT]': amount.toString(),
      // Добавляем дополнительные поля, которые могут быть обязательными
      'fields[STAGE_ID]': 'NEW', // Стадия счета
      'fields[CATEGORY_ID]': '0', // Категория (0 для основной категории)
    };
    
    console.log('📋 Данные для создания счета:', invoiceData);

    const response = await fetch(`${CORRECT_WEBHOOK_URL}crm.item.add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(invoiceData)
    });

    const result = await response.json();

    if (result.result) {
      console.log('✅ Счет создан успешно:', result.result);
      return {
        success: true,
        invoiceId: result.result,
      };
    } else {
      console.error('❌ Ошибка создания счета:', result.error_description);
      
      // Попробуем альтернативный подход - создание через обычный API счетов
      console.log('🔄 Пробуем альтернативный метод создания счета...');
      
      try {
        const alternativeInvoiceData = {
          'fields[TITLE]': `Счет по сделке #${dealId}`,
          'fields[DEAL_ID]': dealId.toString(),
          'fields[CURRENCY]': currency,
          'fields[STATUS_ID]': 'NEW',
          'fields[ASSIGNED_BY_ID]': '30902',
          'fields[ACCOUNT_NUMBER]': `INV-${Date.now()}`,
          'fields[COMMENTS]': 'Счет создан автоматически при формировании ссылки на оплату',
          'fields[AMOUNT]': amount.toString(),
        };
        
        const altResponse = await fetch(`${CORRECT_WEBHOOK_URL}crm.invoice.add`, {
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