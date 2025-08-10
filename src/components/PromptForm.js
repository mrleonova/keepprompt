import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Tag } from 'lucide-react';
import { validatePrompt, generateTemplate } from '../utils/helpers';
import './PromptForm.css';

const PromptForm = ({ 
  prompt = null, 
  categories = [], 
  isOpen, 
  onClose, 
  onSave,
  onAddCategory 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'general',
    tags: [],
    isFavorite: false
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when prompt changes or form opens
  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title || '',
        description: prompt.description || '',
        content: prompt.content || '',
        category: prompt.category || 'general',
        tags: prompt.tags || [],
        isFavorite: prompt.isFavorite || false
      });
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        category: 'general',
        tags: [],
        isFavorite: false
      });
    }
    setErrors({});
    setTagInput('');
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

  const handleTagAdd = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
    }
    setTagInput('');
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        handleTagAdd(tagInput);
      }
    }
    if (e.key === 'Backspace' && !tagInput && formData.tags.length > 0) {
      handleTagRemove(formData.tags[formData.tags.length - 1]);
    }
  };

  const loadTemplate = (templateType) => {
    const template = generateTemplate(templateType);
    setFormData(prev => ({
      ...prev,
      ...template,
      tags: [...prev.tags, ...template.tags]
    }));
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

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="form-select"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
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
              maxLength={300}
              rows={2}
            />
            {errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
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
            />
            {errors.content && (
              <div className="error-message">{errors.content}</div>
            )}
            <div className="char-count">
              {formData.content.length} / 10,000 characters
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Tag size={16} />
              Tags
            </label>
            <div className="tags-container">
              <div className="tags-list">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="tag-remove"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="tag-input"
                  placeholder="Add tags..."
                />
              </div>
            </div>
          </div>

          <div className="template-section">
            <label className="form-label">
              <Sparkles size={16} />
              Quick Templates
            </label>
            <div className="template-buttons">
              <button
                type="button"
                onClick={() => loadTemplate('codeReview')}
                className="btn-template"
              >
                Code Review
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('writing')}
                className="btn-template"
              >
                Writing
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('analysis')}
                className="btn-template"
              >
                Analysis
              </button>
              <button
                type="button"
                onClick={() => loadTemplate('creative')}
                className="btn-template"
              >
                Creative
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => handleInputChange('isFavorite', e.target.checked)}
              />
              <span className="checkbox-label">Add to favorites</span>
            </label>
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