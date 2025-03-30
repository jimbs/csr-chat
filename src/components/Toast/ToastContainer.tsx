import React from 'react';
import { useToast } from '../../context/ToastContext';
import styles from './Toast.module.scss';

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`${styles.toast} ${styles[toast.type]}`}
        >
          <div className={styles.toastContent}>
            <p>{toast.message}</p>
          </div>
          <button 
            className={styles.closeButton} 
            onClick={() => toast.id && hideToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};