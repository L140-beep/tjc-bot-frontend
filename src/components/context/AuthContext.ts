import { createContext, useContext } from 'react';
import { User } from '../../types';

export const AuthContext = createContext<User | null>(null);

export const useAuthContext = () => {
  const value = useContext(AuthContext);

  return value;
};
