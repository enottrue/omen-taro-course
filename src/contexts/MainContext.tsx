import React, { createContext, useEffect, useState } from 'react';
import cookie from 'cookie';
import { useQuery, gql } from '@apollo/client';

import { GET_USER } from '@/graphql/queries';

// Create the context
export const MainContext = createContext<{
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentForm: string | null;
  setCurrentForm: React.Dispatch<React.SetStateAction<string | null>>;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  stageData: any;
  setStageData: React.Dispatch<React.SetStateAction<any>>;
} | null>(null);

// Create the context provider
export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stageData, setStageData] = useState<any>(null);

  // Получаем данные из cookies
  let bearer: string | null = null;
  let tuserId: string | null = null;
  
  if (typeof window !== 'undefined') {
    const cookies = cookie.parse(document.cookie);
    bearer = cookies.Bearer || null;
    tuserId = cookies.userId || null;
  }

  const [token, setToken] = useState<string | null>(bearer);
  const [userId, setUserId] = useState<string | null>(tuserId);
  const [user, setUser] = useState<any>(null);

  // Загружаем данные пользователя
  const { data: userData, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
  });

  // Обновляем пользователя когда данные загружаются
  useEffect(() => {
    if (userData?.getUser) {
      setUser(userData.getUser);
    }
  }, [userData]);

  return (
    <MainContext.Provider
      value={{
        modalOpen,
        setModalOpen,
        currentForm,
        setCurrentForm,
        submitting,
        setSubmitting,
        token,
        setToken,
        menuOpen,
        setMenuOpen,
        userId,
        setUserId,
        user,
        setUser,
        stageData,
        setStageData,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
