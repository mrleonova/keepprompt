import React from 'react';
import Toast from './Toast';
import './ToastContainer.css';

const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          duration={0} // Duration handled by useToast hook
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;