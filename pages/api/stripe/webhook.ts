import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { emailService } from '@/utils/emailService';
import { getStripeSecretKey, getStripeWebhookSecret, logEnvironmentInfo } from '../../../src/utils/environment';

const prisma = new PrismaClient();

// Логируем информацию об окружении
logEnvironmentInfo();

// Функция для получения правильного секретного ключа для webhook
function getStripeSecretKeyForWebhook(): string {
  // Для webhook используем NODE_ENV как основной индикатор
  // Webhook должен работать в том же режиме, что и основное приложение
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.log('🔧 Using test Stripe keys for Development environment (webhook)');
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

// Функция для получения правильного webhook секрета
function getStripeWebhookSecretForEnvironment(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    const testSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET;
    if (!testSecret) {
      throw new Error('STRIPE_TEST_WEBHOOK_SECRET not found in environment variables');
    }
    return testSecret;
  }
  
  const productionSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!productionSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not found in environment variables');
  }
  
  return productionSecret;
}

const stripe = new Stripe(getStripeSecretKeyForWebhook(), {
  apiVersion: '2025-06-30.basil',
});

// Функция для обновления статуса invoice в Bitrix24
async function updateInvoiceStatus(invoiceId: string, status: 'PAID' | 'CANCELLED'): Promise<boolean> {
  try {
    const webhookUrl = 'https://crm.taroirena.com/rest/1/62s3v3dkougs3qsm/';
    
    const updateData = {
      'entityTypeId': '31', // ID типа смарт-процесса для счетов
      'id': invoiceId,
      'fields[stageId]': status === 'PAID' ? 'PAID' : 'CANCELLED'
    };
    
    console.log('📄 Обновление статуса invoice в Bitrix24:', { invoiceId, status });
    
    const response = await fetch(`${webhookUrl}crm.item.update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(updateData)
    });
    
    const result = await response.json();
    
    if (result.result) {
      console.log('✅ Статус invoice обновлен успешно');
      return true;
    } else {
      console.error('❌ Ошибка обновления статуса invoice:', result.error_description);
      
      // Попробуем альтернативный метод через обычный API счетов
      try {
        const altUpdateData = {
          'id': invoiceId,
          'fields[stageId]': status === 'PAID' ? 'PAID' : 'CANCELLED'
        };
        
        const altResponse = await fetch(`${webhookUrl}crm.invoice.update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(altUpdateData)
        });
        
        const altResult = await altResponse.json();
        
        if (altResult.result) {
          console.log('✅ Статус invoice обновлен через альтернативный метод');
          return true;
        } else {
          console.error('❌ Ошибка альтернативного обновления статуса invoice:', altResult.error_description);
          return false;
        }
      } catch (altError) {
        console.error('❌ Ошибка альтернативного метода обновления статуса:', altError);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Ошибка обновления статуса invoice:', error);
    return false;
  }
}

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

const webhookSecret = getStripeWebhookSecretForEnvironment();

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
      
      // Обновляем статус invoice в Bitrix24
      if (invoiceId) {
        console.log('📄 Updating invoice status in Bitrix24...');
        const invoiceUpdated = await updateInvoiceStatus(invoiceId, 'PAID');
        if (invoiceUpdated) {
          console.log('✅ Invoice status updated to PAID');
        } else {
          console.warn('⚠️ Failed to update invoice status, but continuing...');
        }
      }
      
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
    
    // Обновляем статус invoice в Bitrix24 на CANCELLED
    const invoiceId = session.metadata?.invoice_id;
    if (invoiceId) {
      console.log('📄 Updating invoice status to CANCELLED in Bitrix24...');
      const invoiceUpdated = await updateInvoiceStatus(invoiceId, 'CANCELLED');
      if (invoiceUpdated) {
        console.log('✅ Invoice status updated to CANCELLED');
      } else {
        console.warn('⚠️ Failed to update invoice status to CANCELLED');
      }
    }
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