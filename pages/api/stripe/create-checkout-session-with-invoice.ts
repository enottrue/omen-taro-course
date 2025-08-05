import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getStripeSecretKey, logEnvironmentInfo } from '../../../src/utils/environment';

// Логируем информацию об окружении
logEnvironmentInfo();

// Правильный webhook URL
const CORRECT_WEBHOOK_URL = 'https://crm.taroirena.com/rest/1/62s3v3dkougs3qsm/';

// Функция для определения окружения на сервере
function getServerEnvironment(req: NextApiRequest): 'development' | 'production' {
  // Проверяем referer или origin для определения URL параметров
  const referer = req.headers.referer;
  if (referer) {
    const url = new URL(referer);
    return url.searchParams.get('ENV') === 'Development' ? 'development' : 'production';
  }
  
  // Fallback к NODE_ENV
  return process.env.NODE_ENV === 'development' ? 'development' : 'production';
}

// Функция для получения правильного секретного ключа на основе окружения
function getStripeSecretKeyForRequest(req: NextApiRequest): string {
  const env = getServerEnvironment(req);
  
  if (env === 'development') {
    console.log('🔧 Using test Stripe keys for Development environment');
    const testKey = process.env.STRIPE_TEST_SECRET_KEY;
    if (!testKey) {
      throw new Error('STRIPE_TEST_SECRET_KEY not found in environment variables');
    }
    return testKey;
  }
  
  // В продакшене используем ключи из .env
  const productionKey = process.env.STRIPE_SECRET_KEY;
  if (!productionKey) {
    throw new Error('STRIPE_SECRET_KEY not found in environment variables');
  }
  
  return productionKey;
}

// Функция для создания счета в Bitrix24
async function createInvoiceWithCorrectFields(dealId: number, amount: number, currency: string = 'USD', email: string, productName: string = 'Cosmo Course', productId: string = '1'): Promise<{
  success: boolean;
  invoiceId?: number;
  error?: string;
}> {
  console.log('💰 Создание счета в Bitrix24...');
  console.log('📋 Данные счета:', { dealId, amount, currency, productName });

  // Конфигурация
  const WEBHOOK_URL = 'https://crm.taroirena.com/rest/1/62s3v3dkougs3qsm/';

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
      
      // Добавляем товар к счету
      console.log('📦 Добавляем товар к счету...');
      try {
        // Сначала проверяем существование товара
        console.log('🔍 Проверяем существование товара с ID:', productId);
        const productCheckResponse = await fetch(`${WEBHOOK_URL}crm.product.get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ id: productId })
        });
        
        const productCheckResult = await productCheckResponse.json();
        
        if (!productCheckResult.result) {
          console.error('❌ Товар с ID', productId, 'не найден в Bitrix24');
          console.log('📋 Ответ от Bitrix24:', productCheckResult);
        } else {
          console.log('✅ Товар найден:', productCheckResult.result.NAME);
        }
        
        const productRowData = {
          'ownerType': 'SI', // Тип владельца (SI - смарт-процесс счет)
          'ownerId': invoiceId.toString(),
          'productRows[0][productId]': 1777, // ID товара в Bitrix24
          'productRows[0][price]': amount.toString(),
          'productRows[0][quantity]': '1',
          'productRows[0][sort]': '10'
        };
        
        console.log('📋 Данные для добавления товара:', productRowData);
        
        const productResponse = await fetch(`${WEBHOOK_URL}crm.item.productrow.set`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(productRowData)
        });
        
        const productResult = await productResponse.json();
        
        console.log('📋 Полный ответ от API добавления товара:', productResult);
        
        if (productResult.result) {
          console.log('✅ Товар добавлен к счету:', productResult.result);
        } else {
          console.error('❌ Ошибка добавления товара:', productResult.error_description);
          console.error('❌ Код ошибки:', productResult.error);
          console.error('❌ Полная ошибка:', productResult);
          
          // Попробуем альтернативный метод добавления товара
          console.log('🔄 Пробуем альтернативный метод добавления товара...');
          try {
            const altProductRowData = {
              'ownerType': 'SI',
              'ownerId': invoiceId.toString(),
              'productRows[0][productId]': productId,
              'productRows[0][price]': amount.toString(),
              'productRows[0][quantity]': '1',
              'productRows[0][sort]': '10'
            };
            
            console.log('📋 Альтернативные данные для добавления товара:', altProductRowData);
            
            const altProductResponse = await fetch(`${WEBHOOK_URL}crm.item.productrow.add`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams(altProductRowData)
            });
            
            const altProductResult = await altProductResponse.json();
            console.log('📋 Ответ от альтернативного API добавления товара:', altProductResult);
            
            if (altProductResult.result) {
              console.log('✅ Товар добавлен через альтернативный метод:', altProductResult.result);
            } else {
              console.error('❌ Ошибка альтернативного добавления товара:', altProductResult.error_description);
            }
          } catch (altProductError) {
            console.error('❌ Ошибка альтернативного метода добавления товара:', altProductError);
          }
          
          // Не возвращаем ошибку, так как счет уже создан
        }
      } catch (productError) {
        console.error('❌ Ошибка добавления товара:', productError);
        // Не возвращаем ошибку, так как счет уже создан
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
          
          // Добавляем товар к счету (альтернативный метод)
          console.log('📦 Добавляем товар к счету (альтернативный метод)...');
          try {
            // Сначала проверяем существование товара
            console.log('🔍 Проверяем существование товара с ID (альтернативный метод):', productId);
            const productCheckResponse = await fetch(`${WEBHOOK_URL}crm.product.get`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({ id: productId })
            });
            
            const productCheckResult = await productCheckResponse.json();
            
            if (!productCheckResult.result) {
              console.error('❌ Товар с ID', productId, 'не найден в Bitrix24 (альтернативный метод)');
              console.log('📋 Ответ от Bitrix24 (альтернативный метод):', productCheckResult);
            } else {
              console.log('✅ Товар найден (альтернативный метод):', productCheckResult.result.NAME);
            }
            
            const productRowData = {
              'ownerType': 'I', // Тип владельца (I - обычный счет)
              'ownerId': altResult.result.toString(),
              'productRows[0][productId]': productId, // ID товара в Bitrix24
              'productRows[0][price]': amount.toString(),
              'productRows[0][quantity]': '1',
              'productRows[0][sort]': '10'
            };
            
            console.log('📋 Данные для добавления товара (альтернативный метод):', productRowData);
            
            const productResponse = await fetch(`${WEBHOOK_URL}crm.invoice.productrows.set`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams(productRowData)
            });
            
            const productResult = await productResponse.json();
            
            console.log('📋 Полный ответ от API добавления товара (альтернативный метод):', productResult);
            
            if (productResult.result) {
              console.log('✅ Товар добавлен к счету (альтернативный метод):', productResult.result);
            } else {
              console.error('❌ Ошибка добавления товара (альтернативный метод):', productResult.error_description);
              console.error('❌ Код ошибки (альтернативный метод):', productResult.error);
              console.error('❌ Полная ошибка (альтернативный метод):', productResult);
              // Не возвращаем ошибку, так как счет уже создан
            }
          } catch (productError) {
            console.error('❌ Ошибка добавления товара (альтернативный метод):', productError);
            // Не возвращаем ошибку, так как счет уже создан
          }
          
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



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('🚀 API endpoint вызван (исправленная версия):', req.url);
  console.log('📅 Время:', new Date().toISOString());
  console.log('📋 Request method:', req.method);
  console.log('📋 Request headers:', req.headers);
  
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      email, 
      dealId, 
      productName = 'Cosmo Course',
      amount = 5000, // $50.00 in cents
      currency = 'usd',
      ga_client_id,
      product_id,
      page_identifier 
    } = req.body;
    
    console.log('📧 Received data:', { email, dealId, productName, amount, currency, product_id });
    console.log('🔍 Проверяем dealId:', dealId, 'тип:', typeof dealId);
    console.log('🔍 Проверяем product_id:', product_id, 'тип:', typeof product_id);
    
    // Проверяем product_id и устанавливаем значение по умолчанию если пустой
    const finalProductId = product_id && product_id !== '' ? product_id : '1';
    console.log('🔍 Используем product_id:', finalProductId);

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!dealId) {
      return res.status(400).json({ error: 'Deal ID is required' });
    }

    console.log('💰 Creating invoice in Bitrix24...');
    console.log('📋 Параметры для создания счета:', {
      dealId,
      amount: amount / 100,
      currency: currency.toUpperCase()
    });
    
    // Создаем счет в Битрикс24 с правильными полями
    const invoiceResult = await createInvoiceWithCorrectFields(dealId, amount / 100, currency.toUpperCase(), email, productName, finalProductId);
    
    console.log('📊 Результат создания счета:', invoiceResult);
    
    if (!invoiceResult.success) {
      console.error('❌ Failed to create invoice:', invoiceResult.error);
      return res.status(500).json({ 
        error: 'Failed to create invoice in Bitrix24',
        details: {
          invoiceError: invoiceResult.error,
          webhookUrl: CORRECT_WEBHOOK_URL
        }
      });
    }

    const invoiceId = invoiceResult.invoiceId;
    if (!invoiceId) {
      console.error('❌ Invoice ID is undefined');
      return res.status(500).json({ error: 'Invoice ID is undefined' });
    }
    
    console.log('✅ Invoice created successfully:', invoiceId);

    // Товар добавляется автоматически в нашем новом API endpoint
    console.log('📦 Product will be added automatically by the invoice API');

    console.log('🔄 Creating Stripe checkout session...');
    
    // Используем правильный секретный ключ на основе окружения
    const stripeSecretKey = getStripeSecretKeyForRequest(req);
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-06-30.basil',
    });
    
    // Build a valid absolute URL for Stripe
    const origin =
      (typeof req.headers.origin === 'string' && req.headers.origin) ||
      (req.headers.host ? `http://${req.headers.host}` : 'http://localhost:3000');

    console.log('🌍 Stripe origin:', origin);

    // Create Stripe checkout session with enhanced metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: productName,
              description: 'Personalized financial astrology course',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      customer_email: email,
      metadata: {
        email: email,
        product: 'cosmo_course',
        invoice_id: invoiceId.toString(),
        deal_id: dealId.toString(),
        ga_client_id: ga_client_id || '',
        item_id: finalProductId || '',
        item_name: productName,
        page_identifier: page_identifier || '',
      },
    });

    console.log('✅ Stripe session created successfully:', session.id);
    res.status(200).json({ 
      sessionId: session.id,
      invoiceId: invoiceId,
      dealId: dealId
    });
  } catch (error) {
    console.error('❌ Error creating checkout session with invoice:', error);
    console.error('❌ Error details:', {
      message: (error as any).message,
      type: (error as any).type,
      statusCode: (error as any).statusCode
    });
    res.status(500).json({ error: 'Error creating checkout session with invoice' });
  }
} 