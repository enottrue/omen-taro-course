import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createInvoice, addProductToInvoice } from '../../../src/utils/bitrix24';
import { getStripeSecretKey, logEnvironmentInfo } from '../../../src/utils/environment';

// Логируем информацию об окружении
logEnvironmentInfo();

const stripe = new Stripe(getStripeSecretKey(), {
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

    console.log('💰 Creating invoice in Bitrix24...');
    
    // Создаем счет в Битрикс24
    const invoiceResult = await createInvoice(dealId, amount / 100, currency.toUpperCase());
    
    if (!invoiceResult.success) {
      console.error('❌ Failed to create invoice:', invoiceResult.error);
      return res.status(500).json({ error: 'Failed to create invoice in Bitrix24' });
    }

    const invoiceId = invoiceResult.invoiceId;
    if (!invoiceId) {
      console.error('❌ Invoice ID is undefined');
      return res.status(500).json({ error: 'Invoice ID is undefined' });
    }
    
    console.log('✅ Invoice created successfully:', invoiceId);

    // Добавляем товар к счету
    const productAdded = await addProductToInvoice(invoiceId, productName, amount / 100);
    
    if (!productAdded) {
      console.warn('⚠️ Failed to add product to invoice, but continuing...');
    }

    console.log('🔄 Creating Stripe checkout session...');
    
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
        ga_client_id: ga_client_id || null,
        deal_id: dealId.toString(),
        item_id: product_id || null,
        item_name: page_identifier || null,
      },
    });

    console.log('✅ Stripe session created successfully:', session.id);
    console.log('📋 Session metadata:', session.metadata);
    
    res.status(200).json({ 
      sessionId: session.id,
      invoiceId: invoiceId,
      dealId: dealId
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