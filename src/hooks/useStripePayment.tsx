import { useContext, useState } from 'react';
import { MainContext } from '@/contexts/MainContext';
import { createCheckoutSession, redirectToCheckout, createCheckoutSessionWithInvoice } from '@/utils/stripeCheckout';
import { useGoogleAnalytics } from './useGoogleAnalytics';

export const useStripePayment = () => {
  const context = useContext(MainContext);
  const { trackCheckoutStart, trackCheckoutSubmit, trackPaymentFailed, trackPurchase } = useGoogleAnalytics();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    // Блокируем повторные нажатия
    if (isLoading) {
      console.log('🔄 Payment already in progress, ignoring click');
      return;
    }

    console.log('🔍 handlePayment вызван');
    setIsLoading(true);
    
    try {
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
        console.log('🔍 [Stripe] Opening registration modal');
        context.setModalOpen(true);
        context.setCurrentForm('register');
        
        // Небольшая задержка для отслеживания
        setTimeout(() => {
          console.log('🔍 [Stripe] Modal state after opening:', {
            modalOpen: context.modalOpen,
            currentForm: context.currentForm
          });
        }, 100);
        
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

      console.log('🔄 Создаем сессию оплаты с invoice для dealId:', dealId);
      
      // Отслеживаем начало оплаты
      trackCheckoutStart(`deal_${dealId}`);
      
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
        dealId: context?.user?.bitrix24DealId
      };
      localStorage.setItem('stripe_error_debug', JSON.stringify(errorDebugLog));
      
      throw error;
    } finally {
      // Сбрасываем состояние загрузки только в случае ошибки
      // Если успешно - перенаправление произойдет и состояние сбросится автоматически
      if (typeof window !== 'undefined') {
        // Небольшая задержка перед сбросом состояния, чтобы пользователь увидел сообщение об ошибке
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);
      } else {
        setIsLoading(false);
      }
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
    // Блокируем повторные нажатия
    if (isLoading) {
      console.log('🔄 Payment already in progress, ignoring click');
      return;
    }

    setIsLoading(true);

    try {
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
    } finally {
      // Сбрасываем состояние загрузки только в случае ошибки
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);
      } else {
        setIsLoading(false);
      }
    }
  };

  return {
    handlePayment,
    handlePaymentWithInvoice,
    isAuthenticated: !!(context?.token && context?.user),
    isLoading,
  };
}; 