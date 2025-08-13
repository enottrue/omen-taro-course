import { useEffect, useState } from 'react';
import { getEnvironment } from '../utils/environment';

/**
 * Компонент для подключения стилей расширения дизайна до 480px
 * Работает только в режиме development (?ENV=Development)
 */
export const DevelopmentStyles = () => {
  const [environment, setEnvironment] = useState<string>('');

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
      
      console.log('🔧 Development 480px styles loaded');
      
      // Очистка при размонтировании компонента
      return () => {
        const existingLink = document.getElementById('development-480px-styles');
        if (existingLink) {
          existingLink.remove();
          console.log('🔧 Development 480px styles removed');
        }
      };
    }
  }, [environment]);

  // Компонент не рендерит ничего в DOM
  return null;
};

export default DevelopmentStyles;
