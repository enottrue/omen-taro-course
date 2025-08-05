import { loadStripe } from '@stripe/stripe-js';
import { getStripePublishableKey } from './environment';

const stripePromise = loadStripe(getStripePublishableKey());

export async function redirectToCheckout(sessionId: string) {
  const stripe = await stripePromise;
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  await stripe.redirectToCheckout({ sessionId });
}

export async function createCheckoutSession(email: string): Promise<string> {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const data = await response.json();
  return data.sessionId;
}

// Новая функция для создания checkout session с invoice в Битрикс24
export async function createCheckoutSessionWithInvoice(data: {
  email: string;
  dealId: number;
  productName?: string;
  amount?: number;
  currency?: string;
  ga_client_id?: string;
  product_id?: string;
  page_identifier?: string;
}): Promise<{
  sessionId: string;
  invoiceId: number;
  dealId: number;
}> {
  const response = await fetch('/api/stripe/create-checkout-session-with-invoice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create checkout session with invoice');
  }

  const result = await response.json();
  return {
    sessionId: result.sessionId,
    invoiceId: result.invoiceId,
    dealId: result.dealId,
  };
} 