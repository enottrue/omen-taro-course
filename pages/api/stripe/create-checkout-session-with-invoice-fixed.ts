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
async function createInvoiceWithCorrectUrl(dealId: number, amount: number, currency: string = 'RUB'): Promise<{
  success: boolean;
  invoiceId?: number;
  error?: string;
}> {
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
    const invoiceResult = await createInvoiceWithCorrectUrl(dealId, amount / 100, currency.toUpperCase());
    
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