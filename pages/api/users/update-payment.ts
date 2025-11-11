import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { emailService } from '@/utils/emailService';

const prisma = new PrismaClient();
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
    const { sessionId, userId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    console.log('🔄 Processing payment update for session:', sessionId);

    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      expand: ['data.price.product'],
    });
    
    console.log('📊 Stripe session status:', session.payment_status);
    console.log('📊 Stripe session mode:', session.mode);

    if (session.payment_status === 'paid') {
      // Find user by email from session metadata
      const userEmail = session.customer_email || session.metadata?.email;
      
      if (!userEmail) {
        return res.status(400).json({ error: 'No email found in session' });
      }

      const purchasePayload = {
        sessionId,
        amountTotal: session.amount_total,
        amountSubtotal: session.amount_subtotal,
        currency: session.currency,
        paymentStatus: session.payment_status,
        paymentIntentId:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id,
        paymentMethodTypes: session.payment_method_types,
        invoiceId: session.invoice,
        customerId:
          typeof session.customer === 'string'
            ? session.customer
            : session.customer?.id,
        metadata: session.metadata,
        lineItems: lineItems.data.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          amountSubtotal: item.amount_subtotal,
          amountTotal: item.amount_total,
          currency: item.currency,
          price: item.price
            ? {
                id: item.price.id,
                product: item.price.product,
                unitAmount: item.price.unit_amount,
                currency: item.price.currency,
              }
            : null,
        })),
      };

      console.log('👤 Updating payment status for user:', userEmail);

      const existingUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const alreadyProcessed =
        existingUser.stripeSessionId === sessionId && existingUser.isPaid;

      if (alreadyProcessed) {
        console.log(
          'ℹ️ Payment session already processed for user, skipping duplicate email.',
        );

        return res.status(200).json({
          success: true,
          message: 'Payment already processed',
          user: {
            email: existingUser.email,
            isPaid: existingUser.isPaid,
            paymentDate: existingUser.paymentDate,
          },
          purchase: purchasePayload,
          alreadyProcessed: true,
        });
      }

      // Update user payment status
      const updatedUser = await prisma.user.update({
        where: { email: userEmail },
        data: {
          isPaid: true,
          paymentDate: new Date(),
          stripeSessionId: sessionId,
        },
      });

      console.log('✅ User payment status updated successfully:', updatedUser.email);

      // Send payment success email once per session
      try {
        const userName = updatedUser.name || updatedUser.email?.split('@')[0] || 'User';
        const emailResult = await emailService.sendPaymentSuccessEmail(
          updatedUser.email,
          userName,
          'https://astro-irena.com/courses',
        );
        
        if (emailResult.success) {
          console.log('📧 Payment success email sent successfully');
        } else {
          console.error('❌ Failed to send payment success email:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Error sending payment success email:', emailError);
      }

      res.status(200).json({ 
        success: true,
        message: 'Payment status updated successfully',
        user: {
          email: updatedUser.email,
          isPaid: updatedUser.isPaid,
          paymentDate: updatedUser.paymentDate,
        },
        purchase: purchasePayload,
      });
    } else {
      console.log('❌ Payment not completed. Status:', session.payment_status);
      res.status(400).json({ 
        error: 'Payment not completed', 
        status: session.payment_status 
      });
    }
  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    res.status(500).json({ 
      error: 'Error updating payment status',
      details: (error as any).message 
    });
  }
} 