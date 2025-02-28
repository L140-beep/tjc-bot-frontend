import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Auth } from './components/Auth.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <StrictMode>
            <App />
          </StrictMode>
        }
      ></Route>
      <Route path="/auth" element={<Auth />}></Route>
    </Routes>
  </BrowserRouter>,
);
