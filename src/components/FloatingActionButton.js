import React from 'react';
import { Plus } from 'lucide-react';
import './FloatingActionButton.css';

const FloatingActionButton = ({ onClick, disabled = false, ariaLabel = "Add new prompt" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="fab"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Plus size={24} />
    </button>
  );
};

export default FloatingActionButton;