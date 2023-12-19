import React, { createContext, useState } from 'react';

// Create the context
export const MainContext = createContext<{
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentForm: string | null;
  setCurrentForm: React.Dispatch<React.SetStateAction<string | null>>;
} | null>(null);

// Create the context provider
export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<string | null>(null);
  return (
    <MainContext.Provider
      value={{ modalOpen, setModalOpen, currentForm, setCurrentForm }}
    >
      {children}
    </MainContext.Provider>
  );
};
