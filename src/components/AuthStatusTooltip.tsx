import React, { useContext, useState, useEffect } from 'react';
import { MainContext } from '@/contexts/MainContext';
import Cookies from 'js-cookie';

const AuthStatusTooltip: React.FC = () => {
  const cc = useContext(MainContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Обработка гидратации
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Скрываем в продакшене
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (!isDevelopment) return null;
  
  // Не рендерим на сервере
  if (!isClient) return null;

  // Получаем данные из контекста и cookies
  const contextToken = cc?.token;
  const contextUserId = cc?.userId;
  const contextUser = cc?.user;
  
  const cookies = typeof window !== 'undefined' ? Cookies.get() : {};
  const cookieToken = cookies.Bearer;
  const cookieUserId = cookies.userId;
  
  // Проверяем localStorage
  const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const localStorageUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const onboardedStatus = typeof window !== 'undefined' ? localStorage.getItem('onboarded') : null;

  const isAuthenticated = !!(contextToken || cookieToken);
  const userId = contextUserId || cookieUserId;
  
  // Проверяем время истечения токена
  const getTokenExpiry = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = new Date(payload.exp * 1000);
      return expiry;
    } catch {
      return null;
    }
  };
  
  const tokenExpiry = cookieToken ? getTokenExpiry(cookieToken) : null;
  const isTokenExpired = tokenExpiry ? tokenExpiry < new Date() : false;

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      backgroundColor: '#333',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      userSelect: 'none'
    }} onClick={toggleVisibility}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        🔐 Auth Status Tooltip
      </div>
      
      {isVisible && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '5px' }}>
            <strong>Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <strong>Context Token:</strong> {contextToken ? '✅ Present' : '❌ Missing'}
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <strong>Cookie Token:</strong> {cookieToken ? '✅ Present' : '❌ Missing'}
            {cookieToken && (
              <div style={{ marginLeft: '10px', fontSize: '11px' }}>
                {isTokenExpired ? '⚠️ Expired' : '✅ Valid'}
                {tokenExpiry && ` (expires: ${tokenExpiry.toLocaleString()})`}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <strong>User ID:</strong> {userId || '❌ Missing'}
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <strong>localStorage:</strong>
            <div style={{ marginLeft: '10px', fontSize: '11px' }}>
              <div>Token: {localStorageToken ? '✅ Present' : '❌ Missing'}</div>
              <div>User ID: {localStorageUserId || '❌ Missing'}</div>
              <div>Onboarded: {onboardedStatus || '❌ Missing'}</div>
            </div>
          </div>
          
          {contextUser && (
            <div style={{ marginBottom: '5px' }}>
              <strong>User Data:</strong>
              <div style={{ marginLeft: '10px', fontSize: '11px' }}>
                <div>Name: {contextUser.name}</div>
                <div>Email: {contextUser.email}</div>
                <div>Onboarded: {contextUser.onboarded ? '✅ Yes' : '❌ No'}</div>
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '10px', fontSize: '11px', opacity: 0.8 }}>
            Click to toggle details
          </div>
        </div>
      )}
      
      {!isVisible && (
        <div style={{ fontSize: '11px', opacity: 0.8 }}>
          {isAuthenticated ? '✅ Auth' : '❌ No Auth'} - Click for details
        </div>
      )}
    </div>
  );
};

export default AuthStatusTooltip; 