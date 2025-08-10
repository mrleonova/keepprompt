import React from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ type = 'prompts', onNewPrompt, searchTerm }) => {
  const getEmptyStateContent = () => {
    if (searchTerm) {
      return {
        icon: <Search size={48} />,
        title: 'No prompts found',
        description: `No prompts match "${searchTerm}". Try different keywords or clear your search.`,
        action: {
          text: 'Clear Search',
          onClick: () => {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
              searchInput.value = '';
              searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
        }
      };
    }

    switch (type) {
      case 'prompts':
      default:
        return {
          icon: <FileText size={48} />,
          title: 'No prompts yet',
          description: 'Create your first AI prompt to get started. Organize, manage, and reuse your favorite prompts efficiently.',
          action: {
            text: 'Create Your First Prompt',
            onClick: onNewPrompt,
            primary: true
          },
          tips: [
            'Use Ctrl+N or press "N" to quickly create a new prompt',
            'Click on any prompt card to copy it to clipboard',
            'Use tags and categories to organize your prompts',
          ]
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          {content.icon}
        </div>
        
        <div className="empty-state-text">
          <h3 className="empty-state-title">{content.title}</h3>
          <p className="empty-state-description">{content.description}</p>
        </div>

        {content.action && (
          <button
            onClick={content.action.onClick}
            className={`empty-state-action ${content.action.primary ? 'btn-primary' : 'btn-secondary'}`}
          >
            {content.action.primary && <Plus size={18} />}
            {content.action.text}
          </button>
        )}

        {content.tips && (
          <div className="empty-state-tips">
            <h4>Quick Tips:</h4>
            <ul>
              {content.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;