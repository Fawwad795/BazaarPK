import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { installGlobalErrorHandlers } from './lib/crashReporting';
import { ensureSeedData } from './services/firestoreService';

installGlobalErrorHandlers();
void ensureSeedData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
