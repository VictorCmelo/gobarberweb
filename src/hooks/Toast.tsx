import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';

import Toast from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = uuid();

      const toast = {
        id,
        type,
        title,
        description,
      };

      setMessage((oldMessage) => [...oldMessage, toast]);
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    setMessage((state) => state.filter((messages) => messages.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ removeToast, addToast }}>
      {children}
      <Toast messages={message} />
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
