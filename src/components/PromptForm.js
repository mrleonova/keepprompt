import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { validatePrompt } from '../utils/helpers';
import { useDebounce } from '../hooks/useDebounce';
import './PromptForm.css';

const PromptForm = ({ 
  prompt = null, 
  isOpen, 
  onClose, 
  onSave,
  onAddCategory,
  enableAutoSave = true
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: [],
    isFavorite: false
  });
  // const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // 'saving', 'saved', 'error'

  // Auto-save functionality
  const [debouncedAutoSave] = useDebounce(async (data) => {
    if (prompt && isDirty && enableAutoSave) {
      try {
        setAutoSaveStatus('saving');
        await onSave(data);
        setAutoSaveStatus('saved');
        setIsDirty(false);
        setTimeout(() => setAutoSaveStatus(''), 2000);
      } catch (error) {
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus(''), 3000);
      }
    }
  }, 2000);
  // Initialize form data when prompt changes or form opens
  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title || '',
        description: prompt.description || '',
        content: prompt.content || '',
        tags: prompt.tags || [],
        isFavorite: prompt.isFavorite || false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        tags: [],
        isFavorite: false
      });
    }
    setErrors({});
    // setTagInput('');
    setIsDirty(false);
    setAutoSaveStatus('');
  }, [prompt, isOpen]);

  const handleInputChange = (field, value) => {
    const newData = {
      ...formData,
      [field]: field === 'category' ? 'general' : value
    };
    
    setFormData(newData);
    setIsDirty(true);
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    // Trigger auto-save for existing prompts
    if (prompt && enableAutoSave) {
      debouncedAutoSave(newData);
    }
  };

  // Commented out unused functions
  // const handleTagAdd = (tag) => {
  //   const trimmedTag = tag.trim().toLowerCase();
  //   if (trimmedTag && !formData.tags.includes(trimmedTag)) {
  //     setFormData(prev => ({
  //       ...prev,
  //       tags: [...prev.tags, trimmedTag]
  //     }));
  //   }
  //   setTagInput('');
  // };

  // const handleTagRemove = (tagToRemove) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     tags: prev.tags.filter(tag => tag !== tagToRemove)
  //   }));
  // };

  // Commented out unused function
  // const handleTagInputKeyDown = (e) => {
  //   if (e.key === 'Enter' || e.key === ',') {
  //     e.preventDefault();
  //     if (tagInput.trim()) {
  //       handleTagAdd(tagInput);
  //     }
  //   }
  //   if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
  //     handleTagRemove(formData.tags[formData.tags.length - 1]);
  //   }
  // };

  // Commented out unused function
  // const loadTemplate = (templateType) => {
  //   const template = generateTemplate(templateType);
  //   setFormData(prev => ({
  //     ...prev,
  //     ...template,
  //     tags: [...prev.tags, ...template.tags]
  //   }));
  // };

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
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="modal-title">{prompt ? 'Edit Prompt' : 'New Prompt'}</h2>
          <div className="header-status" aria-live="polite" aria-atomic="true">
            {autoSaveStatus === 'saving' && (
              <span className="auto-save-status saving" role="status">Saving...</span>
            )}
            {autoSaveStatus === 'saved' && (
              <span className="auto-save-status saved" role="status">Saved</span>
            )}
            {autoSaveStatus === 'error' && (
              <span className="auto-save-status error" role="alert">Save failed</span>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="btn-close" 
            aria-label="Close modal"
            title="Close (Escape)"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="prompt-form" noValidate>
          <div id="modal-description" className="sr-only">
            {prompt ? 'Edit your existing prompt details' : 'Create a new AI prompt by filling out the form below'}
          </div>

          {errors.general && (
            <div className="error-message general" role="alert" aria-live="assertive">
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
                aria-invalid={errors.title ? 'true' : 'false'}
                aria-describedby={errors.title ? 'title-error' : 'title-count'}
              />
              {errors.title && (
                <div id="title-error" className="error-message" role="alert" aria-live="polite">
                  {errors.title}
                </div>
              )}
              <div id="title-count" className="char-count" aria-live="polite">
                <span className={formData.title.length > 80 ? 'warning' : ''}>
                  {formData.title.length}
                </span>
                <span className="separator">/</span>
                <span>100</span>
              </div>
            </div>
          </div>

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
              aria-invalid={errors.content ? 'true' : 'false'}
              aria-describedby={errors.content ? 'content-error' : 'content-count'}
            />
            {errors.content && (
              <div id="content-error" className="error-message" role="alert" aria-live="polite">
                {errors.content}
              </div>
            )}
            <div id="content-count" className="char-count content-count" aria-live="polite">
              <span className={formData.content.length > 8000 ? 'warning' : formData.content.length > 9000 ? 'danger' : ''}>
                {formData.content.length}
              </span>
              <span className="separator">/</span>
              <span>10,000</span>
              <span className="words">• {formData.content.trim().split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>

          <div className="form-actions" role="group" aria-label="Form actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
              aria-describedby="cancel-help"
            >
              Cancel
            </button>
            <div id="cancel-help" className="sr-only">Cancel and close the form without saving</div>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              aria-describedby="save-help"
            >
              <Save size={16} aria-hidden="true" />
              {isLoading ? 'Saving...' : prompt ? 'Update Prompt' : 'Save Prompt'}
            </button>
            <div id="save-help" className="sr-only">
              {isLoading ? 'Saving prompt...' : 'Save the prompt and close the form'}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptForm;