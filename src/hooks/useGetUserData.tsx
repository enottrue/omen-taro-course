import { useState, useEffect, useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';

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

interface UseGetUserDataReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGetUserData = (userId?: string | number): UseGetUserDataReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(MainContext);

  const fetchUserData = async () => {
    if (!userId) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.user);
      
      // Обновляем контекст с данными пользователя
      if (context) {
        context.setUser(data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const refetch = () => {
    fetchUserData();
  };

  return {
    user,
    loading,
    error,
    refetch,
  };
};

export const useGetLazyUserData = (): UseGetUserDataReturn & { fetchUser: (userId: string | number) => void } => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(MainContext);

  const fetchUser = async (userId: string | number) => {
    if (!userId) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.user);
      
      // Обновляем контекст с данными пользователя
      if (context) {
        context.setUser(data.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (user?.id) {
      fetchUser(user.id);
    }
  };

  return {
    user,
    loading,
    error,
    refetch,
    fetchUser,
  };
};
