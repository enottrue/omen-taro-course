import React, { useContext, useState, useEffect } from 'react';
import { setOnboardingStatus } from '@/utils/onboardingUtils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { MainContext } from '@/contexts/MainContext';

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const cc = useContext(MainContext);
  const [isClient, setIsClient] = useState(false);
  
  // Обработка гидратации
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Не рендерим на сервере
  if (!isClient) return null;

  const handleLogout = () => {
    // Очищаем cookies
    Cookies.remove('Bearer');
    Cookies.remove('userId');
    
    // Очищаем localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setOnboardingStatus('false');
    
    // Очищаем контекст
    cc?.setToken(null);
    cc?.setUserId(null);
    cc?.setUser(null);
    cc?.setMenuOpen(false);
    
    // Перенаправляем на главную
    router.push('/');
  };

  return (
    <button 
      onClick={handleLogout}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '10px 20px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 9998,
        fontSize: '14px',
        fontWeight: 'bold'
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton; 