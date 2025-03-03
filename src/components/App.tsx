import { BrowserRouter, Route, Routes } from 'react-router';
import { Auth } from './Auth';
import { useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { User } from '../types';
import { WithAuth } from './WithAuth';
import { Main } from './Main';

export const App: React.FC = () => {
  const getCachedUser = () => {
    sessionStorage;
    const isAdmin = Boolean(sessionStorage.getItem('isAdmin'));
    const token = sessionStorage.getItem('token');
    console.log(isAdmin);
    if (isAdmin === undefined || !token) return null;

    return {
      isAdmin,
      token,
    };
  };
  // TODO: заменить на редьюсер
  const [currentUser, serCurrentUser] = useState<User | null>(getCachedUser());
  return (
    <AuthContext.Provider value={[currentUser, serCurrentUser]}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <WithAuth>
                <Main />
              </WithAuth>
            }
          ></Route>
          <Route path="/auth" element={<Auth />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};
