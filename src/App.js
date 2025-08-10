import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import PromptList from './components/PromptList';
import PromptForm from './components/PromptForm';
import ToastContainer from './components/ToastContainer';
import { usePrompts } from './hooks/usePrompts';
import { useCategories } from './hooks/useCategories';
import { useSettings } from './hooks/useSettings';
import { useSearch } from './hooks/useSearch';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useToast } from './hooks/useToast';
import { downloadData } from './utils/helpers';
import { dataManager } from './utils/storage';
import './App.css';

function App() {
  // State management
  const { prompts, loading: promptsLoading, addPrompt, updatePrompt, deletePrompt, toggleFavorite, incrementUsage } = usePrompts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { settings, toggleTheme } = useSettings();
  
  // Local state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  // Enhanced toast system
  const { toasts, success, error, info, removeToast } = useToast();
  
  // Search and filtering
  const { 
    searchTerm, 
    categoryFilter, 
    sortBy, 
    sortOrder, 
    filteredPrompts,
    updateSearchTerm,
    updateCategoryFilter,
    updateSort,
    toggleSortOrder
  } = useSearch(prompts);

  // Memoized values
  const isLoading = promptsLoading || categoriesLoading;

  // Handler functions
  const handleNewPrompt = useCallback(() => {
    setEditingPrompt(null);
    setIsFormOpen(true);
  }, []);

  const handleEditPrompt = useCallback((prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  }, []);

  const handleSavePrompt = useCallback(async (promptData) => {
    try {
      if (editingPrompt) {
        await updatePrompt(editingPrompt.id, promptData);
        success('Prompt updated successfully!');
      } else {
        await addPrompt(promptData);
        success('Prompt created successfully!');
      }
      setIsFormOpen(false);
      setEditingPrompt(null);
    } catch (error) {
      error('Failed to save prompt');
      throw error;
    }
  }, [editingPrompt, updatePrompt, addPrompt, success]);

  const handleDeletePrompt = useCallback(async (promptId) => {
    if (settings?.confirmDelete && !window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }
    
    try {
      await deletePrompt(promptId);
      success('Prompt deleted successfully!');
    } catch (err) {
      error('Failed to delete prompt');
    }
  }, [deletePrompt, settings?.confirmDelete, success, error]);

  const handleToggleFavorite = useCallback(async (promptId) => {
    try {
      await toggleFavorite(promptId);
      const prompt = prompts.find(p => p.id === promptId);
      const isFavorite = prompt?.isFavorite;
      info(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (err) {
      error('Failed to update favorite');
    }
  }, [toggleFavorite, prompts, info, error]);

  const handleUsePrompt = useCallback(async (promptId) => {
    try {
      incrementUsage(promptId);
      success('Copied to clipboard!', 2000);
    } catch (err) {
      error('Failed to copy prompt');
    }
  }, [incrementUsage, success, error]);

  const handleExport = useCallback(() => {
    try {
      const data = dataManager.export();
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `keepprompt-backup-${timestamp}.json`;
      
      if (downloadData(data, filename)) {
        success('Data exported successfully!');
      } else {
        error('Failed to export data');
      }
    } catch (err) {
      error('Failed to export data');
    }
  }, [success, error]);

  const handleImport = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      
      if (dataManager.import(text)) {
        success('Data imported successfully! Please refresh the page.');
      } else {
        error('Failed to import data - invalid format');
      }
    } catch (err) {
      error('Failed to import data');
    }
    
    // Reset file input
    event.target.value = '';
  }, [success, error]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingPrompt(null);
  }, []);

  // Keyboard shortcuts
  const shortcuts = useMemo(() => ({
    'ctrl+n': handleNewPrompt,
    'ctrl+t': toggleTheme,
    'escape': () => isFormOpen && handleCloseForm(),
    'ctrl+k': () => {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    'ctrl+f': () => {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    },
    'ctrl+e': handleExport,
    // Single key shortcuts (when not typing)
    'new': handleNewPrompt,
    'search': () => document.querySelector('.search-input')?.focus(),
  }), [handleNewPrompt, toggleTheme, isFormOpen, handleCloseForm, handleExport]);

  useKeyboardShortcuts(settings?.enableKeyboardShortcuts ? shortcuts : {});

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="spinner large"></div>
          <h2>Loading KeepPrompt...</h2>
          <p>Setting up your prompt library</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        searchTerm={searchTerm}
        onSearchChange={updateSearchTerm}
        onNewPrompt={handleNewPrompt}
        onExport={handleExport}
        onImport={handleImport}
      />

      <main className="app-main">
        <PromptList
          prompts={filteredPrompts}
          categories={categories}
          categoryFilter={categoryFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onCategoryFilterChange={updateCategoryFilter}
          onSortChange={updateSort}
          onToggleSortOrder={toggleSortOrder}
          onEditPrompt={handleEditPrompt}
          onDeletePrompt={handleDeletePrompt}
          onToggleFavorite={handleToggleFavorite}
          onUsePrompt={handleUsePrompt}
          onNewPrompt={handleNewPrompt}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showUsageStats={settings?.showUsageStats}
          searchTerm={searchTerm}
        />
      </main>

      <PromptForm
        prompt={editingPrompt}
        categories={categories}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSavePrompt}
      />

      {/* Enhanced Toast System */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      <footer className="app-footer no-print">
        <div className="container">
          <p>
            KeepPrompt - Your AI Prompt Library • 
            <span className="shortcut-hint">
              Press Ctrl+N for new prompt, Ctrl+T for theme toggle
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
