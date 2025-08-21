import { useCallback } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const useGoogleAnalytics = () => {
  const trackEvent = useCallback((action: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, parameters);
      // Вывод в консоль для тестирования
      console.log('Google Analytics Event:', action, parameters);
    } else {
      console.warn('Google Analytics not available');
    }
  }, []);

  const trackVideoImpression = useCallback((videoTitle: string, videoProvider: string, videoUrl: string) => {
    trackEvent('video_impression', {
      video_title: videoTitle,
      video_provider: videoProvider,
      video_url: videoUrl
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackVideoImpression
  };
};
