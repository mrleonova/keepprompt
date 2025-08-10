import React from 'react';
import { Edit, Trash2, Copy, Clock, TrendingUp } from 'lucide-react';
import { formatDate, truncateText, copyToClipboard } from '../utils/helpers';
import './PromptCard.css';

const PromptCard = ({ 
  prompt, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  onUse,
  showUsageStats = true 
}) => {
  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.description || prompt.title);
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
      className="prompt-card"
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
        </div>

        <div className="card-actions">
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
        {prompt.description && (
          <p>{truncateText(prompt.description, 200)}</p>
        )}
      </div>

      <div className="card-footer">
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