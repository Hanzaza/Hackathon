'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isImmersiveMapActive: boolean;
  setIsImmersiveMapActive: (active: boolean) => void;
}

const UIContext = createContext<UIContextType>({
  isImmersiveMapActive: false,
  setIsImmersiveMapActive: () => {},
});

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isImmersiveMapActive, setIsImmersiveMapActive] = useState<boolean>(false);

  return (
    <UIContext.Provider value={{ isImmersiveMapActive, setIsImmersiveMapActive }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
