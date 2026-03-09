import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { WatchlistProvider } from './store/watchlist.jsx';
import { ToastProvider } from './components/Toast.jsx';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
