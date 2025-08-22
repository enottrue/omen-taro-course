import { useEffect, useRef } from 'react';
import { useGoogleAnalytics } from './useGoogleAnalytics';

export const useScrollTracking = () => {
  const { trackScrollDepth } = useGoogleAnalytics();
  const scrollTracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Отслеживаем контрольные точки скролла
      const checkpoints = [25, 50, 75, 100];
      
      checkpoints.forEach(checkpoint => {
        if (scrollPercent >= checkpoint && !scrollTracked.current.has(checkpoint)) {
          scrollTracked.current.add(checkpoint);
          trackScrollDepth(checkpoint);
          
          // Логирование для отладки
          console.log(`📊 Scroll depth reached: ${checkpoint}%`);
        }
      });
    };

    // Добавляем слушатель скролла
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Очистка при размонтировании
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [trackScrollDepth]);

  return null;
};
