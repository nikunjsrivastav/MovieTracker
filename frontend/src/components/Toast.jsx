import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

// Simple success/error/info SVGs
const ICONS = {
  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="#30D158"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="#FF453A"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="#0A84FF"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a12,12,0,1,1,12,12A12,12,0,0,1,120,80Zm24,96H112a8,8,0,0,1,0-16h8V128h-8a8,8,0,0,1,0-16h16a8,8,0,0,1,8,8v40h8a8,8,0,0,1,0,16Z"></path></svg>`
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container rendered globally via Portal conceptually, but here at root */}
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: 'var(--space-xl)', right: 'var(--space-xl)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type}`} style={{ position: 'relative', bottom: 'auto', right: 'auto', animation: 'slideUp 0.3s ease' }}>
              <span dangerouslySetInnerHTML={{ __html: ICONS[toast.type] || ICONS.info }} style={{ display: 'flex', alignItems: 'center' }} />
              <span style={{ transform: 'translateY(1px)' }}>{toast.message}</span>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
