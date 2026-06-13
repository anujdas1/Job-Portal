import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Vite exposes VITE_* vars via import.meta.env
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_KEY) {
  document.getElementById('root').innerHTML = `
    <div style="font-family:sans-serif;padding:2rem;color:#991b1b;background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;margin:2rem;max-width:600px">
      <h2>⚠️ Configuration Error</h2>
      <p>Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>frontend/.env</code>.</p>
      <p>Please add your Clerk publishable key and restart the dev server.</p>
    </div>`;
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={CLERK_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
