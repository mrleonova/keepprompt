import React from 'react';
import { Filter, SortAsc, SortDesc, Grid, List } from 'lucide-react';
import PromptCard from './PromptCard';
import './PromptList.css';

const PromptList = ({ 
  prompts = [], 
  sortBy, 
  sortOrder, 
  onSortChange,
  onToggleSortOrder,
  onEditPrompt, 
  onDeletePrompt, 
  onToggleFavorite, 
  onUsePrompt,
  viewMode = 'grid',
  onViewModeChange,
  showUsageStats = true,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="prompt-list-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading prompts...</p>
        </div>
      </div>
    );
  }

  const sortOptions = [
    { value: 'updatedAt', label: 'Last Modified' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' }
  ];
  return (
    <div className="prompt-list">
      <div className="list-controls">
        <div className="sort-group">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
            aria-label="Sort by"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={onToggleSortOrder}
            className="btn-sort-order"
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </button>
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No prompts found</h3>
          <p>No prompts found.</p>
        </div>
      ) : (
        <div className={`prompts-grid ${viewMode}`}>
          {prompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={onEditPrompt}
              onDelete={onDeletePrompt}
              onToggleFavorite={onToggleFavorite}
              onUse={onUsePrompt}
              showUsageStats={showUsageStats}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PromptList;