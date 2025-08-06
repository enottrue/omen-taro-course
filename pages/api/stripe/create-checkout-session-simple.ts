import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getStripeSecretKey, logEnvironmentInfo } from '../../../src/utils/environment';

// Логируем информацию об окружении
logEnvironmentInfo();

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('🚀 API endpoint вызван (упрощенная версия):', req.url);
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
      amount = 5000, // $50.00 in cents
      currency = 'usd',
      ga_client_id,
      product_id,
      page_identifier 
    } = req.body;
    
    console.log('📧 Received data:', { email, dealId, productName, amount, currency });

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!dealId) {
      return res.status(400).json({ error: 'Deal ID is required' });
    }

    console.log('🔄 Creating Stripe checkout session (без создания счета в Bitrix24)...');
    
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

    // Create Stripe checkout session без создания счета в Bitrix24
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
        deal_id: dealId.toString(),
        ga_client_id: ga_client_id || '',
        item_id: product_id || '',
        item_name: productName,
        page_identifier: page_identifier || '',
        note: 'Счет в Bitrix24 не создан из-за проблем с правами доступа',
      },
    });

    console.log('✅ Stripe session created successfully:', session.id);
    res.status(200).json({ 
      sessionId: session.id,
      dealId: dealId,
      note: 'Счет в Bitrix24 не создан - используйте эту версию временно'
    });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    console.error('❌ Error details:', {
      message: (error as any).message,
      type: (error as any).type,
      statusCode: (error as any).statusCode
    });
    res.status(500).json({ error: 'Error creating checkout session' });
  }
} 