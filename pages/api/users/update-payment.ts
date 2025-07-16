import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

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
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('📊 Stripe session status:', session.payment_status);
    console.log('📊 Stripe session mode:', session.mode);

    if (session.payment_status === 'paid') {
      // Find user by email from session metadata
      const userEmail = session.customer_email || session.metadata?.email;
      
      if (!userEmail) {
        return res.status(400).json({ error: 'No email found in session' });
      }

      console.log('👤 Updating payment status for user:', userEmail);

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

      res.status(200).json({ 
      success: true,
        message: 'Payment status updated successfully',
      user: {
        email: updatedUser.email,
        isPaid: updatedUser.isPaid,
          paymentDate: updatedUser.paymentDate
        }
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