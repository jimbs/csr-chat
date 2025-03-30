import React, { useEffect } from 'react';
import styles from './Toast.module.scss';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.content}>
        <div className={styles.icon}>
          {type === 'success' && <img src="/assets/Icons/success-icon.svg" alt="Success" />}
          {type === 'error' && <img src="/assets/Icons/error-icon.svg" alt="Error" />}
          {type === 'info' && <img src="/assets/Icons/info-icon.svg" alt="Info" />}
          {type === 'warning' && <img src="/assets/Icons/warning-icon.svg" alt="Warning" />}
        </div>
        <p>{message}</p>
      </div>
      <button className={styles.closeButton} onClick={() => onClose(id)}>
        <span>×</span>
      </button>
    </div>
  );
};