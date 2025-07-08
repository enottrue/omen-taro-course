import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { createCheckoutSession, redirectToCheckout } from '@/utils/stripeCheckout';

export const useStripePayment = () => {
  const context = useContext(MainContext);

  const handlePayment = async () => {
    if (!context) {
      throw new Error('Context not available');
    }

    // Проверяем авторизацию пользователя
    if (!context.token || !context.user) {
      // Если не авторизован - открываем модалку авторизации
      context.setModalOpen(true);
      context.setCurrentForm('auth');
      return;
    }

    // Если авторизован - берем email из данных пользователя
    const userEmail = context.user.email;
    
    if (!userEmail) {
      throw new Error('User email not found');
    }

    try {
      // Создаем сессию оплаты
      const sessionId = await createCheckoutSession(userEmail);
      
      // Перенаправляем на Stripe Checkout
      await redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  };

  return {
    handlePayment,
    isAuthenticated: !!(context?.token && context?.user),
  };
}; 