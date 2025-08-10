import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { validatePrompt } from '../utils/helpers';
import './PromptForm.css';

const PromptForm = ({ 
  prompt = null, 
  isOpen, 
  onClose, 
  onSave,
  onAddCategory 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when prompt changes or form opens
  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title || '',
        content: prompt.content || ''
      });
    } else {
      setFormData({
        title: '',
        content: ''
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
        if (error.includes('Content')) errorMap.content = error;
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

          <div className="form-row">
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
          </div>

          {/* Description removed */}

          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Prompt Content *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className={`form-textarea content ${errors.content ? 'error' : ''}`}
              placeholder="Enter your prompt content here..."
              maxLength={10000}
              rows={8}
              required
            />
            {errors.content && (
              <div className="error-message">{errors.content}</div>
            )}
            <div className="char-count">
              {formData.content.length} / 10,000 characters
            </div>
          </div>

          {/* Tags removed */}

          {/* Quick Templates removed */}

          {/* Favorite checkbox removed */}

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