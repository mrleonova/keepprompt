import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleClose = () => {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
        setIsExiting(false);
      }, 300);
    };

    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
      </div>
      <button
        onClick={handleClose}
        className="toast-close"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;