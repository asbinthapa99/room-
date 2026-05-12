import { useState, useCallback } from 'react';

export type AlertVariant = 'primary' | 'destructive' | 'success' | 'info' | 'warning' | 'secondary' | 'mono';
export type AlertAppearance = 'solid' | 'outline' | 'light' | 'stroke';
export type AlertSize = 'sm' | 'md' | 'lg';

export interface AlertState {
  id: string;
  title: string;
  message: string;
  variant: AlertVariant;
  appearance: AlertAppearance;
  size: AlertSize;
  close: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function useAlert() {
  const [alerts, setAlerts] = useState<AlertState[]>([]);

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
        action?: { label: string; onClick: () => void };
      } = {}
    ) => {
      const {
        variant = 'info',
        appearance = 'light',
        size = 'md',
        close = true,
        duration = 5000,
        icon,
        action,
      } = options;

      const id = generateId();
      const alert: AlertState = {
        id,
        title,
        message,
        variant,
        appearance,
        size,
        close,
        icon,
        action,
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
      addAlert(title, message, { variant: 'success', ...options }),
    [addAlert]
  );

  const error = useCallback(
    (title: string, message: string, options = {}) =>
      addAlert(title, message, { variant: 'destructive', close: true, duration: 7000, ...options }),
    [addAlert]
  );

  const warning = useCallback(
    (title: string, message: string, options = {}) =>
      addAlert(title, message, { variant: 'warning', ...options }),
    [addAlert]
  );

  const info = useCallback(
    (title: string, message: string, options = {}) =>
      addAlert(title, message, { variant: 'info', ...options }),
    [addAlert]
  );

  const loading = useCallback(
    (title: string, message: string) =>
      addAlert(title, message, { variant: 'info', close: false, duration: 0 }),
    [addAlert]
  );

  return {
    alerts,
    addAlert,
    removeAlert,
    success,
    error,
    warning,
    info,
    loading,
  };
}
