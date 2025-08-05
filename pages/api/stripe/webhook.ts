import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { emailService } from '@/utils/emailService';
import { getStripeSecretKey, getStripeWebhookSecret, logEnvironmentInfo } from '../../../src/utils/environment';

const prisma = new PrismaClient();

// Логируем информацию об окружении
logEnvironmentInfo();

const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2025-06-30.basil',
});

// Function to send Yandex Metrica event
const sendYandexMetricaEvent = async (eventName: string, userId?: string) => {
  try {
    // This would typically be sent to your analytics endpoint
    // For now, we'll just log it
    console.log(`📊 Yandex Metrica Event: ${eventName}`, userId ? `for user: ${userId}` : '');
    
    // In a real implementation, you might send this to your frontend
    // or use a server-side analytics service
  } catch (error) {
    console.error('Error sending Yandex Metrica event:', error);
  }
};

const webhookSecret = getStripeWebhookSecret();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  console.log('📦 Received Stripe webhook event:', event.type);

  try {
  switch (event.type) {
    case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('💰 Processing completed checkout session:', session.id);
  
  if (session.payment_status === 'paid') {
    const userEmail = session.customer_email || session.metadata?.email;
    const invoiceId = session.metadata?.invoice_id;
    const dealId = session.metadata?.deal_id;
    const gaClientId = session.metadata?.ga_client_id;
    const itemId = session.metadata?.item_id;
    const itemName = session.metadata?.item_name;
    
    if (!userEmail) {
      console.error('❌ No email found in session:', session.id);
      return;
    }

    console.log('👤 Updating payment status for user:', userEmail);
    console.log('📋 Session metadata:', {
      invoiceId,
      dealId,
      gaClientId,
      itemId,
      itemName
    });

    try {
      const updatedUser = await prisma.user.update({
        where: { email: userEmail },
        data: {
          isPaid: true,
          paymentDate: new Date(),
          stripeSessionId: session.id,
        },
      });
          
      console.log('✅ User payment status updated via webhook:', updatedUser.email);
      
      // Send Yandex Metrica event for successful payment
      await sendYandexMetricaEvent('payment_successful', updatedUser.id.toString());
      
      // Log additional metadata for analytics
      if (gaClientId) {
        console.log('📊 GA Client ID for payment:', gaClientId);
      }
      
      if (invoiceId) {
        console.log('📄 Invoice ID for payment:', invoiceId);
      }
      
      if (dealId) {
        console.log('🤝 Deal ID for payment:', dealId);
      }
      
      // Send payment success email
      try {
        const userName = updatedUser.name || updatedUser.email?.split('@')[0] || 'User';
        const emailResult = await emailService.sendPaymentSuccessEmail(
          userEmail, 
          userName, 
          'https://astro-irena.com/courses'
        );
        
        if (emailResult.success) {
          console.log('📧 Payment success email sent successfully');
        } else {
          console.error('❌ Failed to send payment success email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Error sending payment success email:', emailError);
      }
      
    } catch (error) {
      console.error('❌ Error updating user payment status:', error);
    }
  } else {
    console.log('⚠️ Session not paid. Status:', session.payment_status);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('💳 Processing successful payment intent:', paymentIntent.id);
  
  // You can add additional logic here if needed
  // For example, if you store payment_intent_id in your database
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('📄 Processing successful invoice payment:', invoice.id);
  
  // You can add additional logic here if needed
  // For example, for subscription payments
} 