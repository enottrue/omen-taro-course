import React, { createContext, useState } from 'react';

// Create the context
export const MainContext = createContext<{
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentForm: string | null;
  setCurrentForm: React.Dispatch<React.SetStateAction<string | null>>;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
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

  return (
    <MainContext.Provider
      value={{
        modalOpen,
        setModalOpen,
        currentForm,
        setCurrentForm,
        submitting,
        setSubmitting,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
