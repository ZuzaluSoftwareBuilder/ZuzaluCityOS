import { Alert, Snackbar } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';

interface ToastConfig {
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (config: ToastConfig) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ToastConfig | null>(null);

  const showToast = (toastConfig: ToastConfig) => {
    setConfig(toastConfig);
    setOpen(true);
  };

  const hideToast = () => {
    setConfig(null);
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={config?.duration || 3000}
        onClose={hideToast}
      >
        <Alert severity={config?.severity || 'success'} variant="filled">
          {config?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
