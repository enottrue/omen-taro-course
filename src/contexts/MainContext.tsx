import React, { createContext, useEffect, useState } from 'react';
import cookie from 'cookie';

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
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
