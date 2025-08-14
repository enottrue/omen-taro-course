import { useState, useEffect, useCallback } from 'react';

interface UseBitrix24DealStatusProps {
  userId: string | null;
  initialDealId?: number | null;
}

interface DealStatus {
  isLoading: boolean;
  dealId: number | null;
  contactId: number | null;
  isDealCreated: boolean;
  error: string | null;
}

export const useBitrix24DealStatus = ({ userId, initialDealId }: UseBitrix24DealStatusProps) => {
  const [status, setStatus] = useState<DealStatus>({
    isLoading: false,
    dealId: initialDealId || null,
    contactId: null,
    isDealCreated: !!initialDealId,
    error: null,
  });

  const checkDealStatus = useCallback(async () => {
    if (!userId) return;

    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        const dealId = userData.user?.bitrix24DealId;
        const contactId = userData.user?.bitrix24ContactId;

        setStatus({
          isLoading: false,
          dealId: dealId || null,
          contactId: contactId || null,
          isDealCreated: !!dealId,
          error: null,
        });
      } else {
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to fetch user data',
        }));
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [userId]);

  const triggerDealCreation = useCallback(async () => {
    if (!userId) return;

    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/bitrix24/create-deal-async', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          setStatus({
            isLoading: false,
            dealId: result.dealId,
            contactId: result.contactId,
            isDealCreated: true,
            error: null,
          });
        } else {
          setStatus(prev => ({
            ...prev,
            isLoading: false,
            error: result.error || 'Failed to create deal',
          }));
        }
      } else {
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to create deal',
        }));
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [userId]);

  // Автоматически проверяем статус при изменении userId
  useEffect(() => {
    if (userId) {
      checkDealStatus();
    }
  }, [userId, checkDealStatus]);

  // Если сделка не создана, запускаем периодическую проверку
  useEffect(() => {
    if (!userId || status.isDealCreated) return;

    const interval = setInterval(() => {
      checkDealStatus();
    }, 5000); // Проверяем каждые 5 секунд

    return () => clearInterval(interval);
  }, [userId, status.isDealCreated, checkDealStatus]);

  return {
    ...status,
    checkDealStatus,
    triggerDealCreation,
  };
};
