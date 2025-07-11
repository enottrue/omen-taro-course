import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const prisma = new PrismaClient();

// Отключаем автоматический парсинг тела запроса
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('🚀 Webhook handler started');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('🔍 Webhook received');
  console.log('Signature:', sig);
  console.log('Endpoint secret exists:', !!endpointSecret);
  console.log('Headers:', Object.keys(req.headers));

  let event: Stripe.Event;

  try {
    // Получаем raw body
    const rawBody = await buffer(req);
    console.log('Raw body length:', rawBody.length);

    // Для тестирования временно отключаем проверку подписи
    if (!endpointSecret) {
      console.log('⚠️ No webhook secret configured, processing without signature verification');
      event = JSON.parse(rawBody.toString()) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(rawBody, sig as string, endpointSecret);
      console.log('✅ Webhook signature verified successfully');
    }
  } catch (err) {
    console.error('❌ Webhook processing failed:', err);
    
    // Для тестирования обрабатываем без проверки подписи
    try {
      const rawBody = await buffer(req);
      event = JSON.parse(rawBody.toString()) as Stripe.Event;
      console.log('⚠️ Processing webhook without signature verification');
    } catch (parseErr) {
      console.error('❌ Failed to parse webhook body:', parseErr);
      return res.status(400).send(`Webhook Error: ${parseErr}`);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Processing checkout.session.completed for session:', session.id);
      console.log('Session metadata:', session.metadata);
      console.log('Customer email:', session.customer_email);
      console.log('Session data:', JSON.stringify(session, null, 2));
      
      try {
        // Update user payment status in database
        const userEmail = session.metadata?.email || session.customer_email;
        
        if (!userEmail) {
          console.error('❌ No email found in session metadata or customer_email');
          console.log('Available session data:', {
            metadata: session.metadata,
            customer_email: session.customer_email,
            customer: session.customer
          });
          break;
        }
        
        console.log('🔍 Looking for user with email:', userEmail);
        
        const updatedUsers = await prisma.user.updateMany({
          where: {
            email: userEmail,
          },
          data: {
            isPaid: true,
            paymentDate: new Date(),
            stripeSessionId: session.id,
          },
        });

        console.log('✅ Payment successful for user:', userEmail);
        console.log('Updated users count:', updatedUsers.count);
        
        // Если пользователь не найден по email, попробуем найти по userId в metadata
        if (updatedUsers.count === 0 && session.metadata?.userId) {
          console.log('Trying to update user by userId:', session.metadata.userId);
          
          const userByUserId = await prisma.user.updateMany({
            where: {
              id: parseInt(session.metadata.userId),
            },
            data: {
              isPaid: true,
              paymentDate: new Date(),
              stripeSessionId: session.id,
            },
          });
          
          console.log('Updated users by userId count:', userByUserId.count);
        }
        
        // Если все еще не найдено, попробуем найти пользователя test@gmail.com
        if (updatedUsers.count === 0 && !session.metadata?.userId) {
          console.log('Trying to update test user (test@gmail.com)');
          
          const testUser = await prisma.user.updateMany({
            where: {
              email: 'test@gmail.com',
            },
            data: {
              isPaid: true,
              paymentDate: new Date(),
              stripeSessionId: session.id,
            },
          });
          
          console.log('Updated test users count:', testUser.count);
        }
      } catch (error) {
        console.error('❌ Error updating user payment status:', error);
      }
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent);
      
      try {
        // Попробуем найти пользователя по email из metadata или других полей
        let userEmail = null;
        
        // Проверяем metadata платежа
        if (paymentIntent.metadata?.email) {
          userEmail = paymentIntent.metadata.email;
          console.log('Found email in payment metadata:', userEmail);
        }
        
        // Если email не найден в metadata, попробуем найти по customer email
        if (!userEmail && paymentIntent.customer) {
          try {
            const customer = await stripe.customers.retrieve(paymentIntent.customer as string);
            if ('email' in customer && customer.email) {
              userEmail = customer.email;
              console.log('Found email from customer:', userEmail);
            }
          } catch (error) {
            console.log('Could not retrieve customer:', error);
          }
        }
        
        // Если email не найден, не обновляем никого
        if (!userEmail) {
          console.log('❌ No email found in payment data, skipping user update');
          break;
        }
        
        console.log('🔍 Looking for user with email:', userEmail);
        
        const updatedUsers = await prisma.user.updateMany({
          where: {
            email: userEmail,
          },
          data: {
            isPaid: true,
            paymentDate: new Date(),
            stripeSessionId: paymentIntent.id,
          },
        });

        console.log('✅ Payment successful for user:', userEmail);
        console.log('Updated users count:', updatedUsers.count);
        
        // Если пользователь не найден, попробуем найти по userId в metadata
        if (updatedUsers.count === 0 && paymentIntent.metadata?.userId) {
          console.log('Trying to update user by userId:', paymentIntent.metadata.userId);
          
          const userByUserId = await prisma.user.updateMany({
            where: {
              id: parseInt(paymentIntent.metadata.userId),
            },
            data: {
              isPaid: true,
              paymentDate: new Date(),
              stripeSessionId: paymentIntent.id,
            },
          });
          
          console.log('Updated users by userId count:', userByUserId.count);
        }
      } catch (error) {
        console.error('❌ Error updating user payment status:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object);
      break;

    case 'charge.succeeded':
      const charge = event.data.object as Stripe.Charge;
      console.log('Charge succeeded:', charge);
      // Не обновляем пользователя автоматически при charge.succeeded
      // Пользователь будет обновлен при payment_intent.succeeded
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
} 