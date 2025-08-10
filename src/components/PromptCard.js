import React from 'react';
import { Edit, Trash2, Copy, Heart, Tag, Clock, TrendingUp } from 'lucide-react';
import { formatDate, truncateText, copyToClipboard } from '../utils/helpers';
import './PromptCard.css';

const PromptCard = ({ 
  prompt, 
  categories = [], 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onUse,
  showUsageStats = true 
}) => {
  const category = categories.find(c => c.id === prompt.category) || { name: 'General', color: '#6b7280' };

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.content);
    if (success && onUse) {
      onUse(prompt.id);
    }
  };

  const handleCardClick = (e) => {
    // Don't trigger card click when clicking on action buttons
    if (e.target.closest('.card-actions') || e.target.closest('.card-stats')) {
      return;
    }
    handleCopy();
  };

  return (
    <article 
      className={`prompt-card ${prompt.isFavorite ? 'favorite' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Prompt: ${prompt.title}. Click to copy to clipboard`}
      aria-describedby={`prompt-content-${prompt.id} prompt-meta-${prompt.id}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopy();
        }
      }}
    >
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="card-title" title={prompt.title} id={`prompt-title-${prompt.id}`}>
            {truncateText(prompt.title, 60)}
          </h3>
          {prompt.isFavorite && (
            <Heart 
              className="favorite-icon filled" 
              size={16} 
              aria-hidden="true"
              role="img"
              aria-label="Favorited"
            />
          )}
        </div>

        <div className="card-actions" role="group" aria-label="Prompt actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt.id);
            }}
            className={`btn-action ${prompt.isFavorite ? 'favorited' : ''}`}
            title={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={16} aria-hidden="true" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(prompt);
            }}
            className="btn-action"
            title="Edit prompt"
            aria-label="Edit prompt"
          >
            <Edit size={16} aria-hidden="true" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prompt.id);
            }}
            className="btn-action delete"
            title="Delete prompt"
            aria-label="Delete prompt"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {prompt.description && (
        <p 
          className="card-description" 
          title={prompt.description}
          id={`prompt-desc-${prompt.id}`}
        >
          {truncateText(prompt.description, 120)}
        </p>
      )}

      <div 
        className="card-content" 
        title="Click to copy"
        id={`prompt-content-${prompt.id}`}
        aria-label="Prompt content"
      >
        <p>{truncateText(prompt.content, 200)}</p>
      </div>

      <div className="card-footer" id={`prompt-meta-${prompt.id}`}>
        <div className="card-meta" role="group" aria-label="Prompt metadata">
          <div 
            className="card-category"
            style={{ '--category-color': category.color }}
            role="group"
            aria-label="Category"
          >
            <Tag size={14} aria-hidden="true" />
            <span>{category.name}</span>
          </div>

          {prompt.tags && prompt.tags.length > 0 && (
            <div className="card-tags" role="group" aria-label="Tags">
              {prompt.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="tag"
                  role="listitem"
                  aria-label={`Tag: ${tag}`}
                >
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span 
                  className="tag more"
                  aria-label={`${prompt.tags.length - 3} more tags`}
                >
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="card-stats" role="group" aria-label="Prompt statistics">
          <div 
            className="stat" 
            title={`Created: ${formatDate(prompt.createdAt)}`}
            aria-label={`Last updated ${formatDate(prompt.updatedAt)}`}
          >
            <Clock size={12} aria-hidden="true" />
            <span>{formatDate(prompt.updatedAt)}</span>
          </div>

          {showUsageStats && (
            <div 
              className="stat" 
              title={`Used ${prompt.usageCount || 0} times`}
              aria-label={`Usage count: ${prompt.usageCount || 0}`}
            >
              <TrendingUp size={12} aria-hidden="true" />
              <span>{prompt.usageCount || 0}</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="copy-btn"
            title="Copy to clipboard"
            aria-label="Copy prompt to clipboard"
          >
            <Copy size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PromptCard;