import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { validatePrompt } from '../utils/helpers';
import './PromptForm.css';

const PromptForm = ({ 
  prompt = null, 
  isOpen, 
  onClose, 
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when prompt changes or form opens
  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title || '',
        description: prompt.description || ''
      });
    } else {
      setFormData({
        title: '',
        description: ''
      });
    }
    setErrors({});
  }, [prompt, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validatePrompt(formData);
    if (!validation.isValid) {
      const errorMap = {};
      validation.errors.forEach(error => {
        if (error.includes('Title')) errorMap.title = error;
        if (error.includes('Description')) errorMap.description = error;
      });
      setErrors(errorMap);
      return;
    }

    setIsLoading(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setErrors({ general: 'Failed to save prompt. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{prompt ? 'Edit Prompt' : 'New Prompt'}</h2>
          <button onClick={onClose} className="btn-close" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="prompt-form">
          {errors.general && (
            <div className="error-message general">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter prompt title..."
              maxLength={100}
              required
            />
            {errors.title && (
              <div className="error-message">{errors.title}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Brief description of what this prompt does..."
              maxLength={1000}
              rows={4}
            />
            {errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
            <div className="char-count">
              {formData.description.length} / 1,000 characters
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : prompt ? 'Update Prompt' : 'Save Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptForm;