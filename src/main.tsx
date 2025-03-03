import { StrictMode, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './components/App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Auth } from './components/Auth.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
