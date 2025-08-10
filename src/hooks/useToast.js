import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = {
      id,
      message,
      type,
      duration,
      isVisible: true,
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration (if duration > 0)
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration + 300); // Add 300ms for exit animation
    }

    return id;
  }, [removeToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast types
  const success = useCallback((message, duration) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };
};