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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    console.log('📧 Received email:', email);

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
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

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Cosmo Course',
              description: 'Personalized financial astrology course',
            },
            unit_amount: 100, // $50.00 in cents
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
      },
    });

    console.log('✅ Stripe session created successfully:', session.id);
    res.status(200).json({ sessionId: session.id });
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