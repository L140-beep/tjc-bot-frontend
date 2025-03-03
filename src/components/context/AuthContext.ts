import { createContext, Dispatch, useContext } from 'react';
import { User } from '../../types';

export const AuthContext = createContext<[User | null, Dispatch<User>] | null>(null);

export const useAuthContext = () => {
  const value = useContext(AuthContext);

  // if (!value || value[0] === null);

  return value as [User, Dispatch<User>];
};
