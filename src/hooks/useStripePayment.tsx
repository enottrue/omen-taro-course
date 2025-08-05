import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { createCheckoutSession, redirectToCheckout, createCheckoutSessionWithInvoice } from '@/utils/stripeCheckout';

export const useStripePayment = () => {
  const context = useContext(MainContext);

  const handlePayment = async () => {
    if (!context) {
      throw new Error('Context not available');
    }

    // Проверяем авторизацию пользователя
    if (!context.token || !context.user) {
      // Если не авторизован - открываем модалку регистрации
      context.setModalOpen(true);
      context.setCurrentForm('register');
      return;
    }

    // Если авторизован - берем email из данных пользователя
    const userEmail = context.user.email;
    
    if (!userEmail) {
      throw new Error('User email not found');
    }

    // Проверяем наличие dealId
    const dealId = context.user.bitrix24DealId;
    if (!dealId) {
      console.error('No dealId found for user, using old payment method');
      try {
        // Fallback к старому методу если нет dealId
        const sessionId = await createCheckoutSession(userEmail);
        await redirectToCheckout(sessionId);
      } catch (error) {
        console.error('Payment error:', error);
        throw error;
      }
      return;
    }

    try {
      // Создаем сессию оплаты с invoice
      const result = await createCheckoutSessionWithInvoice({
        email: userEmail,
        dealId,
        productName: 'Cosmo Course',
        amount: 5000, // $50.00 in cents
        currency: 'usd'
      });
      
      console.log('✅ Checkout session with invoice created:', result);
      
      // Перенаправляем на Stripe Checkout
      await redirectToCheckout(result.sessionId);
    } catch (error) {
      console.error('Payment with invoice error:', error);
      throw error;
    }
  };

  // Новая функция для создания платежа с invoice в Битрикс24
  const handlePaymentWithInvoice = async (dealId: number, additionalData?: {
    productName?: string;
    amount?: number;
    currency?: string;
    ga_client_id?: string;
    product_id?: string;
    page_identifier?: string;
  }) => {
    if (!context) {
      throw new Error('Context not available');
    }

    // Проверяем авторизацию пользователя
    if (!context.token || !context.user) {
      // Если не авторизован - открываем модалку регистрации
      context.setModalOpen(true);
      context.setCurrentForm('register');
      return;
    }

    // Если авторизован - берем email из данных пользователя
    const userEmail = context.user.email;
    
    if (!userEmail) {
      throw new Error('User email not found');
    }

    try {
      // Создаем сессию оплаты с invoice
      const result = await createCheckoutSessionWithInvoice({
        email: userEmail,
        dealId,
        ...additionalData
      });
      
      console.log('✅ Checkout session with invoice created:', result);
      
      // Перенаправляем на Stripe Checkout
      await redirectToCheckout(result.sessionId);
    } catch (error) {
      console.error('Payment with invoice error:', error);
      throw error;
    }
  };

  return {
    handlePayment,
    handlePaymentWithInvoice,
    isAuthenticated: !!(context?.token && context?.user),
  };
}; 