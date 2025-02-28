import { Navigate } from 'react-router';
import { AuthContext, useAuthContext } from './context/AuthContext';
import React from 'react';

export const WithAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const user = useAuthContext();
  if (!user) {
    return <Navigate to={'/auth'} />;
  }
  return (
    <AuthContext value={user}>
      <div>{children}</div>
    </AuthContext>
  );
};
