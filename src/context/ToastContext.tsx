import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  message: string;
  type: ToastType;
  id?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: ToastMessage) => void;
  hideToast: (id: string) => void;
  toasts: ToastMessage[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (toast: ToastMessage) => {
    const id = toast.id || Math.random().toString(36).substring(2, 9);
    const duration = toast.duration || 3000;

    const newToast = { ...toast, id, duration };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    if (duration != -1)
      setTimeout(() => {
        hideToast(id);
      }, duration);

    return id;
  };

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
