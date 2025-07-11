import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { gql } from 'graphql-request';
import { request } from 'graphql-request';
import { MainContext } from '@/contexts/MainContext';
import Cookies from 'js-cookie';

// Add server-side logging
if (typeof window !== 'undefined') {
  console.log('Client-side: Current URL:', window.location.href);
  console.log('Client-side: Search params:', window.location.search);
}

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      message
      error
      user {
        id
        email
        name
      }
      token
    }
  }
`;

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cc = useContext(MainContext);
  
  // Extract token from URL manually since router.query might not work properly
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('Reset password page loaded');
    console.log('Router asPath:', router.asPath);
    console.log('Router query:', router.query);
    console.log('MainContext available:', !!cc);
    console.log('MainContext value:', cc);
    
    // Extract token from URL manually
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    console.log('Token from URL params:', tokenFromUrl);
    
    setToken(tokenFromUrl);
    
    if (!tokenFromUrl) {
      console.log('No token found, setting error');
      setError('Недействительная ссылка для сброса пароля');
    } else {
      console.log('Token found:', tokenFromUrl);
    }
  }, [router.asPath, router.query, cc]);

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!token) {
      setError('Недействительная ссылка для сброса пароля');
      setLoading(false);
      return;
    }

    if (!password || !validatePassword(password)) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting reset password form');
      console.log('Token:', token);
      console.log('Password:', password);
      
      const response = await request('/api/graphql', RESET_PASSWORD_MUTATION, {
        token: token as string,
        newPassword: password
      }) as any;

      console.log('Full GraphQL response:', response);
      console.log('Reset password response:', response.resetPassword);
      console.log('Error field:', response.resetPassword.error);
      console.log('Error field type:', typeof response.resetPassword.error);

      if (response.resetPassword.error === 'true' || response.resetPassword.error === true) {
        console.log('Error detected, setting error message');
        setError(response.resetPassword.message);
      } else {
        console.log('No error detected, proceeding with success flow');
        console.log('Reset password response:', response.resetPassword);
        setSuccess('Пароль успешно изменен! Выполняется автоматический вход...');
        
        // Automatically log in the user
        if (response.resetPassword.user) {
          const user = response.resetPassword.user;
          const authToken = response.resetPassword.token;
          console.log('User data:', user);
          console.log('Token:', authToken);
          console.log('User onboarded:', user.onboarded);
          
          // Set cookies first (this always works)
          if (authToken) {
            Cookies.set('Bearer', authToken, { expires: 180 });
            Cookies.set('userId', user.id, { expires: 180 });
            console.log('Cookies set successfully');
            
            // Verify authentication was set correctly
            const storedToken = Cookies.get('Bearer');
            const storedUserId = Cookies.get('userId');
            console.log('Stored token:', storedToken);
            console.log('Stored userId:', storedUserId);
            
            // Check if cookies were actually set
            if (storedToken && storedUserId) {
              console.log('✅ Cookies verified successfully');
            } else {
              console.log('❌ Cookies not set properly');
            }
          } else {
            console.log('❌ No auth token received');
          }
          
          // Try to set context if available
          if (cc) {
            console.log('Context available, updating...');
            cc.setToken && cc.setToken(authToken || '');
            cc.setUserId && cc.setUserId(user.id);
            cc.setUser && cc.setUser(user);
            console.log('Context updated successfully');
          } else {
            console.log('Context not available, using cookies only');
          }
          
          // Redirect based on onboarding status
          const redirectPath = user.onboarded ? '/courses' : '/onboarding';
          console.log('Planning redirect to:', redirectPath);
          console.log('User onboarded status:', user.onboarded);
          
          setTimeout(() => {
            console.log('Executing redirect to:', redirectPath);
            router.push(redirectPath);
          }, 2000);
        } else {
          console.log('No user data in response');
          setError('Ошибка: данные пользователя не получены');
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Произошла ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '10px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h2 style={{ color: '#e74c3c', marginBottom: '20px', textAlign: 'center' }}>
            Ошибка
          </h2>
          <p style={{ color: '#666', textAlign: 'center' }}>
            {error || 'Недействительная ссылка для сброса пароля'}
          </p>
          <button 
            onClick={() => router.push('/')}
            style={{
              width: '100%',
              padding: '12px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '10px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#2c3e50' }}>
          Сброс пароля
        </h2>
        
        {error && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ 
            background: '#d4edda', 
            color: '#155724', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Изменение пароля...' : 'Изменить пароль'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 