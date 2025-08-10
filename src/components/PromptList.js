import React from 'react';
import { Filter, SortAsc, SortDesc, Grid, List } from 'lucide-react';
import PromptCard from './PromptCard';
import './PromptList.css';

const PromptList = ({ 
  prompts = [], 
  categories = [], 
  categoryFilter, 
  sortBy, 
  sortOrder, 
  onCategoryFilterChange, 
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
    { value: 'title', label: 'Title' },
    { value: 'usageCount', label: 'Usage Count' },
    { value: 'lastUsed', label: 'Last Used' }
  ];

  return (
    <div className="prompt-list-container">
      <div className="list-header">
        <div className="list-controls">
          <div className="filter-section">
            <div className="filter-group">
              <Filter size={16} />
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className="filter-select"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

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

          <div className="view-controls">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`btn-view ${viewMode === 'grid' ? 'active' : ''}`}
              title="Grid view"
              aria-label="Grid view"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`btn-view ${viewMode === 'list' ? 'active' : ''}`}
              title="List view"
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'}
          </span>
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No prompts found</h3>
          <p>
            {categoryFilter !== 'all' || sortBy !== 'updatedAt'
              ? 'Try adjusting your filters or search terms.'
              : 'Create your first prompt to get started!'
            }
          </p>
        </div>
      ) : (
        <div className={`prompts-grid ${viewMode}`}>
          {prompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              categories={categories}
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
};

export default PromptList;