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
    <div 
      className={`prompt-card ${prompt.isFavorite ? 'favorite' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopy();
        }
      }}
    >
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="card-title" title={prompt.title}>
            {truncateText(prompt.title, 60)}
          </h3>
          {prompt.isFavorite && (
            <Heart className="favorite-icon filled" size={16} />
          )}
        </div>

        <div className="card-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt.id);
            }}
            className={`btn-action ${prompt.isFavorite ? 'favorited' : ''}`}
            title={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={16} />
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
            <Edit size={16} />
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
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {prompt.description && (
        <p className="card-description" title={prompt.description}>
          {truncateText(prompt.description, 120)}
        </p>
      )}

      <div className="card-content" title="Click to copy">
        <p>{truncateText(prompt.content, 200)}</p>
      </div>

      <div className="card-footer">
        <div className="card-meta">
          <div 
            className="card-category"
            style={{ '--category-color': category.color }}
          >
            <Tag size={14} />
            <span>{category.name}</span>
          </div>

          {prompt.tags && prompt.tags.length > 0 && (
            <div className="card-tags">
              {prompt.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="tag more">+{prompt.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <div className="card-stats">
          <div className="stat" title={`Created: ${formatDate(prompt.createdAt)}`}>
            <Clock size={12} />
            <span>{formatDate(prompt.updatedAt)}</span>
          </div>

          {showUsageStats && (
            <div className="stat" title={`Used ${prompt.usageCount || 0} times`}>
              <TrendingUp size={12} />
              <span>{prompt.usageCount || 0}</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="btn-copy"
            title="Copy to clipboard"
            aria-label="Copy to clipboard"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;