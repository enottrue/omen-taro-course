import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Debug logging
console.log('🔑 Stripe Secret Key (first 10 chars):', process.env.STRIPE_SECRET_KEY?.substring(0, 10) + '...');
console.log('🔑 Stripe Secret Key length:', process.env.STRIPE_SECRET_KEY?.length);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

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
            unit_amount: 5000, // $50.00 in cents
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