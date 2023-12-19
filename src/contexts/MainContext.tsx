import React, { createContext, useState } from 'react';

// Create the context
export const MainContext = createContext<{
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>; // Update the type to accept a boolean
} | null>(null);

// Create the context provider
export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <MainContext.Provider value={{ modalOpen, setModalOpen }}>
      {children}
    </MainContext.Provider>
  );
};
