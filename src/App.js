import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import PromptList from './components/PromptList';
import PromptForm from './components/PromptForm';
import { usePrompts } from './hooks/usePrompts';
import { useSettings } from './hooks/useSettings';
import { useSearch } from './hooks/useSearch';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { downloadData } from './utils/helpers';
import { dataManager } from './utils/storage';
import './App.css';

function App() {
  // State management
  const { prompts, loading: promptsLoading, addPrompt, updatePrompt, deletePrompt, toggleFavorite, incrementUsage } = usePrompts();
  const { settings, toggleTheme } = useSettings();
  
  // Local state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Search and filtering
  const { 
    searchTerm, 
    sortBy, 
    sortOrder, 
    filteredPrompts,
    updateSearchTerm,
    updateSort,
    toggleSortOrder
  } = useSearch(prompts);

  // Memoized values
  const isLoading = promptsLoading;
  
  // Toast helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

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
        showToast('Prompt updated successfully!');
      } else {
        await addPrompt(promptData);
        showToast('Prompt created successfully!');
      }
      setIsFormOpen(false);
      setEditingPrompt(null);
    } catch (error) {
      showToast('Failed to save prompt', 'error');
      throw error;
    }
  }, [editingPrompt, updatePrompt, addPrompt, showToast]);

  const handleDeletePrompt = useCallback(async (promptId) => {
    if (settings?.confirmDelete && !window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }
    
    try {
      await deletePrompt(promptId);
      showToast('Prompt deleted successfully!');
    } catch (error) {
      showToast('Failed to delete prompt', 'error');
    }
  }, [deletePrompt, settings?.confirmDelete, showToast]);

  const handleToggleFavorite = useCallback(async (promptId) => {
    try {
      await toggleFavorite(promptId);
      const prompt = prompts.find(p => p.id === promptId);
      const isFavorite = prompt?.isFavorite;
      showToast(isFavorite ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      showToast('Failed to update favorite', 'error');
    }
  }, [toggleFavorite, prompts, showToast]);

  const handleUsePrompt = useCallback(async (promptId) => {
    try {
      incrementUsage(promptId);
      showToast('Copied to clipboard!');
    } catch (error) {
      showToast('Failed to copy prompt', 'error');
    }
  }, [incrementUsage, showToast]);

  const handleExport = useCallback(() => {
    try {
      const data = dataManager.export();
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `keepprompt-backup-${timestamp}.json`;
      
      if (downloadData(data, filename)) {
        showToast('Data exported successfully!');
      } else {
        showToast('Failed to export data', 'error');
      }
    } catch (error) {
      showToast('Failed to export data', 'error');
    }
  }, [showToast]);

  const handleImport = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      
      if (dataManager.import(text)) {
        showToast('Data imported successfully! Please refresh the page.');
      } else {
        showToast('Failed to import data - invalid format', 'error');
      }
    } catch (error) {
      showToast('Failed to import data', 'error');
    }
    
    // Reset file input
    event.target.value = '';
  }, [showToast]);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingPrompt(null);
  }, []);

  // Keyboard shortcuts
  const shortcuts = useMemo(() => ({
    'ctrl+n': handleNewPrompt,
    'ctrl+t': toggleTheme,
    'escape': () => isFormOpen && handleCloseForm(),
    'ctrl+f': () => document.querySelector('.search-input')?.focus(),
    'ctrl+e': handleExport,
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
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={updateSort}
          onToggleSortOrder={toggleSortOrder}
          onEditPrompt={handleEditPrompt}
          onDeletePrompt={handleDeletePrompt}
          onToggleFavorite={handleToggleFavorite}
          onUsePrompt={handleUsePrompt}
          showUsageStats={settings?.showUsageStats}
        />
      </main>

      <PromptForm
        prompt={editingPrompt}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSavePrompt}
      />

      {toast && (
        <div className={`toast ${toast.type} animate-slideUp`}>
          {toast.message}
        </div>
      )}

      <footer className="app-footer no-print">
        <div className="container">
          <p>KeepPrompt</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
