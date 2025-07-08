import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  isPaid?: boolean;
  bitrix24ContactId?: number;
  bitrix24DealId?: number;
  onboarded?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserInfoProps {
  userId: number;
}

const UserInfo: React.FC<UserInfoProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setError('Пользователь не найден');
        }
      } catch (err) {
        setError('Ошибка загрузки данных пользователя');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Загрузка информации о пользователе...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!user) {
    return <div>Пользователь не найден</div>;
  }

  return (
    <div style={{ 
      padding: '15px', 
      backgroundColor: '#f8f9fa', 
      border: '1px solid #dee2e6',
      borderRadius: '5px',
      marginBottom: '20px'
    }}>
      <h3>Информация о пользователе</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        <div>
          <strong>ID:</strong> {user.id}
        </div>
        <div>
          <strong>Имя:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Телефон:</strong> {user.phone || 'Не указан'}
        </div>
        <div>
          <strong>Город:</strong> {user.city || 'Не указан'}
        </div>
        <div>
          <strong>Статус оплаты:</strong> 
          <span style={{ 
            color: user.isPaid ? 'green' : 'red',
            fontWeight: 'bold',
            marginLeft: '5px'
          }}>
            {user.isPaid ? 'Оплачено' : 'Не оплачено'}
          </span>
        </div>
        <div>
          <strong>ID контакта в Битрикс24:</strong> {user.bitrix24ContactId || 'Не создан'}
        </div>
        <div>
          <strong>ID сделки в Битрикс24:</strong> {user.bitrix24DealId || 'Не создана'}
        </div>
        <div>
          <strong>Прошел онбординг:</strong> {user.onboarded ? 'Да' : 'Нет'}
        </div>
        <div>
          <strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleString()}
        </div>
        <div>
          <strong>Последнее обновление:</strong> {new Date(user.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default UserInfo; 