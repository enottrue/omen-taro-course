import { useEffect, useState } from 'react';
import { getEnvironment } from '../utils/environment';

/**
 * Компонент для отображения индикатора 480px режима
 * Стили расширения дизайна теперь работают всегда (перенесены в globals.scss)
 * Индикатор показывает, что режим активен
 */
export const DevelopmentStyles = () => {
  const [environment, setEnvironment] = useState<string>('');
  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    const env = getEnvironment();
    setEnvironment(env);
    
    // Проверяем ширину экрана для показа индикатора
    const checkScreenWidth = () => {
      setIsWideScreen(window.innerWidth >= 375);
    };
    
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  // Показываем индикатор когда экран достаточно широкий для 480px режима
  if (isWideScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: environment === 'development' ? '#4CAF50' : '#2196F3',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        zIndex: 9999,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        fontFamily: 'monospace'
      }}>
        {environment === 'development' ? '🔧 480px Mode' : '📱 480px Mode'}
      </div>
    );
  }

  // Компонент не рендерит ничего в DOM для узких экранов
  return null;
};

export default DevelopmentStyles;
