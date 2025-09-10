import { useEffect, useState } from 'react';
import { getEnvironment } from '../utils/environment';

export const EnvironmentInfo = () => {
  const [environment, setEnvironment] = useState<string>('');

  useEffect(() => {
    const env = getEnvironment();
    setEnvironment(env);
  }, []);

  // Показываем только в development режиме
  if (environment !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#ff6b6b',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      fontWeight: 'bold',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      border: '2px solid #fff'
    }}>
      🔧 DEV MODE
      <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.8 }}>
        Only Module 1 available
      </div>
    </div>
  );
}; 