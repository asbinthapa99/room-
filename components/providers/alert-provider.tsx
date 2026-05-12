'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { AlertVariant, AlertAppearance, AlertSize } from '@/lib/hooks/use-alert';
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
} from 'lucide-react';

export interface AlertMessage {
  id: string;
  title: string;
  message: string;
  variant: AlertVariant;
  appearance: AlertAppearance;
  size: AlertSize;
  close: boolean;
  icon?: React.ReactNode;
}

interface AlertContextType {
  addAlert: (
    title: string,
    message: string,
    options?: {
      variant?: AlertVariant;
      appearance?: AlertAppearance;
      size?: AlertSize;
      close?: boolean;
      duration?: number;
      icon?: React.ReactNode;
    }
  ) => string;
  removeAlert: (id: string) => void;
  success: (title: string, message: string, options?: any) => string;
  error: (title: string, message: string, options?: any) => string;
  warning: (title: string, message: string, options?: any) => string;
  info: (title: string, message: string, options?: any) => string;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addAlert = useCallback(
    (
      title: string,
      message: string,
      options: {
        variant?: AlertVariant;
        appearance?: AlertAppearance;
        size?: AlertSize;
        close?: boolean;
        duration?: number;
        icon?: React.ReactNode;
      } = {}
    ) => {
      const {
        variant = 'info',
        appearance = 'light',
        size = 'md',
        close = true,
        duration = 5000,
        icon,
      } = options;

      const id = generateId();
      const alert: AlertMessage = {
        id,
        title,
        message,
        variant,
        appearance,
        size,
        close,
        icon,
      };

      setAlerts((prev) => [...prev, alert]);

      if (duration > 0) {
        setTimeout(() => {
          removeAlert(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const success = useCallback(
    (title: string, message: string, options = {}) =>
      addAlert(title, message, {
        variant: 'success',
        appearance: 'light',
        ...options,
      }),
    [addAlert]
  );

  const error = useCallback(
    (title: string, message: string, options = {}) =>
      addAlert(title, message, {
        variant: 'destructive',
        appearance: 'light',
        close: true,
        duration: 7000,
        ...options,
      }),
    [addAlert]
  );

  const warning = useCallback(
    (title: string, message: string, options = {}) =>
      addAlert(title, message, {
        variant: 'warning',
        appearance: 'light',
        ...options,
      }),
    [addAlert]
  );

  const info = useCallback(
    (title: string, message: string, options = {}) =>
      addAlert(title, message, {
        variant: 'info',
        appearance: 'light',
        ...options,
      }),
    [addAlert]
  );

  const value: AlertContextType = {
    addAlert,
    removeAlert,
    success,
    error,
    warning,
    info,
  };

  const getAlertIcon = (variant: AlertVariant) => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'destructive':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      case 'primary':
        return <Info className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            appearance={alert.appearance}
            size={alert.size}
            close={alert.close}
            onClose={() => removeAlert(alert.id)}
            className="animate-in slide-in-from-top-2"
          >
            <AlertIcon>{alert.icon || getAlertIcon(alert.variant)}</AlertIcon>
            <AlertContent>
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </AlertContent>
          </Alert>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
}
