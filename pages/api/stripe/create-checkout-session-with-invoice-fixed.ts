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

// Функция для создания счета с правильным URL
async function createInvoiceWithCorrectUrl(dealId: number, amount: number, currency: string = 'RUB', email: string, productName: string = 'Astrology Reading'): Promise<{
  success: boolean;
  invoiceId?: number;
  error?: string;
}> {
  console.log('💰 Создание счета в Битрикс24 (смарт-процесс)...');
  console.log('📋 Данные счета:', { dealId, amount, currency, productName });

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
      'entityTypeId': '31',
      'fields[title]': `Invoice for ${productName} - ${email}`,
      'fields[stageId]': 'NEW',
      'fields[assignedById]': '1',
      'fields[contactId]': '1',
      'fields[opportunity]': (amount / 100).toString(),
      'fields[currencyId]': 'USD',
      'fields[parentId2]': dealId.toString(),
      'fields[ufCrm_SMART_INVOICE_1706948587230]': '1013',
      'fields[ufCrm_67AE0664BC8E9]': '939',
      'fields[mycompanyId]': '51',
      'fields[sourceId]': 'UC_HZ10CI',
      'fields[COMMENTS]': `Astrology Reading Service\nClient: ${email}\nEmail: ${email}\nPrice: ${amount / 100} USD`
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
          'fields[title]': `Invoice for Astrology Reading - ${email}`,
          'fields[stageId]': 'NEW',
          'fields[assignedById]': '1',
          'fields[contactId]': '1',
          'fields[opportunity]': amount.toString(),
          'fields[currencyId]': 'USD',
          'fields[parentId2]': dealId.toString(),
          'fields[mycompanyId]': '51',
          'fields[COMMENTS]': `Astrology Reading Service\nClient: ${email}\nEmail: ${email}\nPrice: ${amount} USD`
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

// Функция для добавления товара к счету
async function addProductToInvoice(invoiceId: number, productName: string, price: number): Promise<boolean> {
  console.log('📦 Добавление товара к счету...');
  console.log('📋 Данные товара:', { invoiceId, productName, price });

  try {
    // Используем правильный метод для добавления товаров к счету
    const addProductData = {
      'ownerType': 'SI', // Тип владельца (SI - Smart Invoice)
      'ownerId': invoiceId.toString(), // ID счета
      'productRows[0][productId]': '1777', // ID товара Compass
      'productRows[0][price]': price.toString(),
      'productRows[0][quantity]': '1',
      'productRows[0][sort]': '10'
    };
    
    console.log('📋 Данные для добавления товара:', addProductData);
    
    const addProductResponse = await fetch(`${CORRECT_WEBHOOK_URL}crm.item.productrow.set`, {
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
      return false;
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
      amount = 100, // $50.00 in cents
      currency = 'usd',
      ga_client_id,
      product_id,
      page_identifier 
    } = req.body;
    
    console.log('📧 Received data:', { email, dealId, productName, amount, currency });
    console.log('🔍 Проверяем dealId:', dealId, 'тип:', typeof dealId);

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
    
    // Создаем счет в Битрикс24 с правильным URL
    const invoiceResult = await createInvoiceWithCorrectUrl(dealId, amount / 100, currency.toUpperCase(), email, productName);
    
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

    // Добавляем товар Compass к счету
    console.log('📦 Adding Compass product to invoice...');
    const productAdded = await addProductToInvoice(invoiceId, 'Compass', amount / 100);
    
    if (!productAdded) {
      console.warn('⚠️ Failed to add product to invoice, but continuing...');
    }

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
        item_id: product_id || '',
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