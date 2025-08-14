import { useEffect, useState } from 'react';
import { getEnvironment } from '../utils/environment';

/**
 * Компонент для подключения стилей расширения дизайна до 480px
 * Работает только в режиме development (?ENV=Development)
 */
export const DevelopmentStyles = () => {
  const [environment, setEnvironment] = useState<string>('');
  const [stylesLoaded, setStylesLoaded] = useState(false);

  useEffect(() => {
    const env = getEnvironment();
    setEnvironment(env);
  }, []);

  // Подключаем стили только в development режиме
  useEffect(() => {
    if (environment === 'development') {
      // Создаем link элемент для подключения стилей
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/css/development-480px.css';
      link.id = 'development-480px-styles';
      
      // Добавляем стили в head
      document.head.appendChild(link);
      
      // Ждем загрузки стилей
      link.onload = () => {
        setStylesLoaded(true);
        console.log('🔧 Development 480px styles loaded successfully');
        
        // Добавляем индикатор в консоль
        console.log('📱 Device Info:', {
          userAgent: navigator.userAgent,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio
        });
      };
      
      // Очистка при размонтировании компонента
      return () => {
        const existingLink = document.getElementById('development-480px-styles');
        if (existingLink) {
          existingLink.remove();
          setStylesLoaded(false);
          console.log('🔧 Development 480px styles removed');
        }
      };
    }
  }, [environment]);

  // Показываем индикатор в development режиме
  if (environment === 'development' && stylesLoaded) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#4CAF50',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        zIndex: 9999,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        fontFamily: 'monospace'
      }}>
        🔧 480px Mode
      </div>
    );
  }

  // Компонент не рендерит ничего в DOM в production
  return null;
};

export default DevelopmentStyles;
