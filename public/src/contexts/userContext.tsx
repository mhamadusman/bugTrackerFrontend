'use client';
import { createContext, useContext, ReactNode, useState } from 'react';
import { profile } from '../components/types/types';

type UserContextType = {
  user: profile | null;
  setUser: (user: profile | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<profile | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};