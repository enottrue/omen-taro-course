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

  return {
    trackEvent,
    trackVideoImpression,
    trackVideoStart,
    trackVideoProgress,
    trackVideoPause,
    trackVideoSeek,
    trackVideoMute,
    trackVideoComplete,
    trackVideoError
  };
};
