import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { createCheckoutSession, redirectToCheckout, createCheckoutSessionWithInvoice } from '@/utils/stripeCheckout';

export const useStripePayment = () => {
  const context = useContext(MainContext);

  const handlePayment = async () => {
    console.log('🔍 handlePayment вызван');
    
    // Сохраняем логи в localStorage для отладки
    const debugLog = {
      timestamp: new Date().toISOString(),
      action: 'handlePayment_called',
      context: !!context,
      token: !!context?.token,
      user: !!context?.user,
      email: context?.user?.email,
      dealId: context?.user?.bitrix24DealId,
      userId: context?.user?.id
    };
    
    localStorage.setItem('stripe_debug_log', JSON.stringify(debugLog));
    console.log('📝 Debug log saved:', debugLog);
    
    if (!context) {
      console.error('❌ Context not available');
      throw new Error('Context not available');
    }

    console.log('👤 Данные пользователя в контексте:', {
      token: context.token ? 'Есть' : 'Нет',
      user: context.user ? 'Есть' : 'Нет',
      email: context.user?.email,
      dealId: context.user?.bitrix24DealId,
      userId: context.user?.id
    });
    
    // Сохраняем полные данные пользователя для отладки
    const userDebugLog = {
      timestamp: new Date().toISOString(),
      action: 'user_data_debug',
      fullUserData: context.user
    };
    localStorage.setItem('stripe_user_debug', JSON.stringify(userDebugLog));

    // Проверяем авторизацию пользователя
    if (!context.token || !context.user) {
      console.log('⚠️ Пользователь не авторизован, открываем модалку регистрации');
      
      // Прокручиваем страницу к верху перед открытием модального окна
      if (typeof window !== 'undefined') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
      // Если не авторизован - открываем модалку регистрации
      context.setModalOpen(true);
      context.setCurrentForm('register');
      return;
    }

    // Если авторизован - берем email из данных пользователя
    const userEmail = context.user.email;
    
    if (!userEmail) {
      console.error('❌ User email not found');
      throw new Error('User email not found');
    }

    // Проверяем наличие dealId
    const dealId = context.user.bitrix24DealId;
    console.log('💰 DealId пользователя:', dealId);
    
    if (!dealId) {
      console.error('❌ No dealId found for user. Deal must be created in Bitrix24 first.');
      throw new Error('Сделка в системе не создана. Пожалуйста, дождитесь создания сделки или обратитесь к администратору.');
    }

    try {
      console.log('🔄 Создаем сессию оплаты с invoice для dealId:', dealId);
      
      // Сохраняем информацию о начале создания счета
      const invoiceDebugLog = {
        timestamp: new Date().toISOString(),
        action: 'creating_invoice',
        dealId: dealId,
        email: userEmail
      };
      localStorage.setItem('stripe_invoice_debug', JSON.stringify(invoiceDebugLog));
      
      // Создаем сессию оплаты с invoice
      const result = await createCheckoutSessionWithInvoice({
        email: userEmail,
        dealId,
        productName: 'Cosmo Course',
        amount: 5000, // $50.00 in cents
        currency: 'usd'
      });
      
      console.log('✅ Checkout session with invoice created:', result);
      
      // Сохраняем результат
      const successDebugLog = {
        timestamp: new Date().toISOString(),
        action: 'invoice_created_successfully',
        sessionId: result.sessionId,
        invoiceId: result.invoiceId,
        dealId: result.dealId
      };
      localStorage.setItem('stripe_success_debug', JSON.stringify(successDebugLog));
      
      // Перенаправляем на Stripe Checkout
      await redirectToCheckout(result.sessionId);
    } catch (error) {
      console.error('❌ Payment with invoice error:', error);
      
      // Сохраняем ошибку
      const errorDebugLog = {
        timestamp: new Date().toISOString(),
        action: 'invoice_creation_error',
        error: error instanceof Error ? error.message : 'Unknown error',
        dealId: dealId
      };
      localStorage.setItem('stripe_error_debug', JSON.stringify(errorDebugLog));
      
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
      // Прокручиваем страницу к верху перед открытием модального окна
      if (typeof window !== 'undefined') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      
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