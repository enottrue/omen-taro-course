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
  setUser: React.Dispatch<React.SetStateAction<null>>;
  stageData: any;
  setStageData: React.Dispatch<React.SetStateAction<any>>;
} | null>(null);

let loading;
let error;
let data: any;
let d;

// Create the context provider
export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  let bearer;
  let tuserId;
  if (typeof window !== 'undefined') {
    const cookies = cookie.parse(document.cookie);
    bearer = cookies.Bearer;
    tuserId = cookies.userId;

    d = useQuery(GET_USER, {
      variables: { id: tuserId },
      skip: !tuserId,
    });

    loading = d.loading;
    error = d.error;
    data = d.data;
  }
  const [modalOpen, setModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(bearer || null);
  const [userId, setUserId] = useState<string | null>(tuserId || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(data?.getUser || null);
  const [stageData, setStageData] = useState<any>(null);

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
