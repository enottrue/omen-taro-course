import { useCallback } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const useGoogleAnalytics = () => {
  const trackEvent = useCallback((action: string, parameters: Record<string, any> = {}) => {
    console.log('🚀 [GA4] trackEvent called:', { action, parameters });
    
    if (typeof window !== 'undefined' && window.gtag) {
      // Добавляем debug_mode для всех событий
      const eventParams = {
        ...parameters,
        debug_mode: true,
        event_timeout: 2000
      };
      
      console.log('📤 [GA4] Sending event to gtag:', { action, eventParams });
      
      window.gtag('event', action, eventParams);
      
      // Детальное логирование для отладки
      console.log('🔍 [GA4] Event Sent Successfully:', {
        event_name: action,
        parameters: eventParams,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        title: document.title
      });
      
      // Проверяем dataLayer
      setTimeout(() => {
      //  console.log('📊 [GA4] DataLayer after event:', window.dataLayer);
      }, 100);
      
    } else {
      console.warn('⚠️ [GA4] Google Analytics not available');
    }
  }, []);

  const trackVideoImpression = useCallback((videoTitle: string, videoProvider: string, videoUrl: string) => {
    trackEvent('video_impression', {
      video_title: videoTitle,
      video_provider: videoProvider,
      video_url: videoUrl
    });
  }, [trackEvent]);

  const trackVideoStart = useCallback((videoTitle: string, videoDuration: number, autoplay: boolean) => {
    trackEvent('video_start', {
      video_title: videoTitle,
      video_duration: videoDuration,
      autoplay: autoplay
    });
  }, [trackEvent]);

  const trackVideoProgress = useCallback((videoPercent: number, videoCurrentTime: number) => {
    trackEvent('video_progress', {
      video_percent: videoPercent,
      video_current_time: videoCurrentTime
    });
  }, [trackEvent]);

  const trackVideoPause = useCallback((videoCurrentTime: number, videoPercent: number) => {
    trackEvent('video_pause', {
      video_current_time: videoCurrentTime,
      video_percent: videoPercent
    });
  }, [trackEvent]);

  const trackVideoSeek = useCallback((fromTime: number, toTime: number) => {
    trackEvent('video_seek', {
      from_time: fromTime,
      to_time: toTime
    });
  }, [trackEvent]);

  const trackVideoMute = useCallback((isMuted: boolean) => {
    const action = isMuted ? 'video_mute' : 'video_unmute';
    trackEvent(action, {});
  }, [trackEvent]);

  const trackVideoComplete = useCallback((videoDuration: number) => {
    trackEvent('video_complete', {
      video_duration: videoDuration
    });
  }, [trackEvent]);

  const trackVideoError = useCallback((errorCode: string, errorMessage: string) => {
    trackEvent('video_error', {
      error_code: errorCode,
      error_message: errorMessage
    });
  }, [trackEvent]);

  // Функция для тестирования целей
  const testGoal = useCallback((goalName: string, goalValue: number = 1) => {
    trackEvent('goal_completion', {
      goal_name: goalName,
      goal_value: goalValue,
      goal_category: 'engagement',
      goal_type: 'custom'
    });
  }, [trackEvent]);

  // Функции для конкретных кнопок на главной странице
  const trackHeroCTA = useCallback((buttonText: string) => {
    trackEvent('hero_cta_click', {
      button_text: buttonText,
      button_position: 'hero_section',
      button_type: 'primary_cta',
      page_section: 'hero'
    });
  }, [trackEvent]);

  const trackVideoCTA = useCallback((buttonText: string) => {
    trackEvent('video_cta_click', {
      button_text: buttonText,
      button_position: 'video_section',
      button_type: 'video_cta',
      page_section: 'video'
    });
  }, [trackEvent]);

  const trackDiscoverCTA = useCallback((buttonText: string) => {
    trackEvent('discover_cta_click', {
      button_text: buttonText,
      button_position: 'discover_section',
      button_type: 'discover_cta',
      page_section: 'discover'
    });
  }, [trackEvent]);

  const trackComponent4CTA = useCallback((buttonText: string) => {
    trackEvent('component4_cta_click', {
      button_text: buttonText,
      button_position: 'component4_section',
      button_type: 'component4_cta',
      page_section: 'component4'
    });
  }, [trackEvent]);

  const trackComponent5CTA = useCallback((buttonText: string) => {
    trackEvent('component5_cta_click', {
      button_text: buttonText,
      button_position: 'component5_section',
      button_type: 'component5_cta',
      page_section: 'component5'
    });
  }, [trackEvent]);

  const trackComponent9CTA = useCallback((buttonText: string) => {
    trackEvent('component9_cta_click', {
      button_text: buttonText,
      button_position: 'component9_section',
      button_type: 'component9_cta',
      page_section: 'component9'
    });
  }, [trackEvent]);

  const trackFooterCTA = useCallback((buttonText: string) => {
    trackEvent('footer_cta_click', {
      button_text: buttonText,
      button_position: 'footer_section',
      button_type: 'footer_cta',
      page_section: 'footer'
    });
  }, [trackEvent]);

  const trackFamilyCTA = useCallback((buttonText: string) => {
    trackEvent('family_cta_click', {
      button_text: buttonText,
      button_position: 'family_section',
      button_type: 'family_cta',
      page_section: 'family'
    });
  }, [trackEvent]);

  // Функции для отслеживания скролла
  const trackScrollDepth = useCallback((scrollPercent: number) => {
    trackEvent('scroll_depth', {
      scroll_percent: scrollPercent,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : ''
    });
  }, [trackEvent]);

  // Функции для отслеживания регистрации
  const trackRegistrationStart = useCallback(() => {
    console.log('🎯 [GA4] trackRegistrationStart called');
    
    const eventData = {
      form_id: 'signup_modal',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : ''
    };
    
    console.log('📊 [GA4] Registration start event data:', eventData);
    
    trackEvent('registration_start', eventData);
  }, [trackEvent]);

  const trackRegistrationSubmit = useCallback((formData: { email: string; name: string }) => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const nameFilled = formData.name.trim().length > 0;
    
    trackEvent('registration_submit', {
      form_id: 'signup_modal',
      email_valid: emailValid,
      name_filled: nameFilled,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : ''
    });
  }, [trackEvent]);

  const trackRegistrationError = useCallback((errorType: string, errorDetails?: any) => {
    trackEvent('registration_error', {
      error_type: errorType,
      error_details: errorDetails,
      form_id: 'signup_modal',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : ''
    });
  }, [trackEvent]);

  const trackRegistrationSuccess = useCallback((userId?: string, email?: string) => {
    const emailHash = email ? btoa(email).slice(0, 8) : undefined;
    
    trackEvent('registration_success', {
      user_id: userId,
      email_hash: emailHash,
      form_id: 'signup_modal',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : ''
    });
  }, [trackEvent]);

  // Функции для отслеживания оплаты
  const trackCheckoutStart = useCallback((checkoutId?: string) => {
    trackEvent('checkout_start', {
      checkout_id: checkoutId,
      course_id: 'money_compass',
      value: 50,
      currency: 'USD',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : ''
    });
  }, [trackEvent]);

  const trackCheckoutSubmit = useCallback((paymentData: { 
    payment_method: string; 
    billing_country?: string; 
    value?: number; 
    currency?: string 
  }) => {
    trackEvent('checkout_submit', {
      payment_method: paymentData.payment_method,
      billing_country: paymentData.billing_country,
      value: paymentData.value || 50,
      currency: paymentData.currency || 'USD',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : ''
    });
  }, [trackEvent]);

  const trackPaymentFailed = useCallback((failureData: {
    failure_type: string;
    payment_method: string;
    error_code?: string;
    value?: number;
    currency?: string;
  }) => {
    trackEvent('payment_failed', {
      failure_type: failureData.failure_type,
      payment_method: failureData.payment_method,
      error_code: failureData.error_code,
      value: failureData.value || 50,
      currency: failureData.currency || 'USD',
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : ''
    });
  }, [trackEvent]);

  const trackPurchase = useCallback((purchaseData: {
    transaction_id: string;
    value?: number;
    currency?: string;
    payment_method: string;
    utm_source?: string;
    coupon?: string;
  }) => {
    trackEvent('purchase', {
      transaction_id: purchaseData.transaction_id,
      value: purchaseData.value || 50,
      currency: purchaseData.currency || 'USD',
      payment_method: purchaseData.payment_method,
      utm_source: purchaseData.utm_source,
      coupon: purchaseData.coupon,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      page_title: typeof document !== 'undefined' ? document.title : ''
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackVideoImpression,
    trackVideoStart,
    trackVideoProgress,
    trackVideoPause,
    trackVideoSeek,
    trackVideoMute,
    trackVideoComplete,
    trackVideoError,
    testGoal,
    // Функции для кнопок
    trackHeroCTA,
    trackVideoCTA,
    trackDiscoverCTA,
    trackComponent4CTA,
    trackComponent5CTA,
    trackComponent9CTA,
    trackFooterCTA,
    trackFamilyCTA,
    // Функции для скролла
    trackScrollDepth,
    // Функции для регистрации
    trackRegistrationStart,
    trackRegistrationSubmit,
    trackRegistrationError,
    trackRegistrationSuccess,
    // Функции для оплаты
    trackCheckoutStart,
    trackCheckoutSubmit,
    trackPaymentFailed,
    trackPurchase
  };
};
