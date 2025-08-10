import { useState, useEffect } from 'react';
import { promptStorage } from '../utils/storage';

export const usePrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load prompts on mount
  useEffect(() => {
    try {
      const storedPrompts = promptStorage.getAll();
      setPrompts(storedPrompts);
      setLoading(false);
    } catch (err) {
      setError('Failed to load prompts');
      setLoading(false);
    }
  }, []);

  const addPrompt = (promptData) => {
    try {
      const newPrompt = promptStorage.add(promptData);
      setPrompts(prev => [...prev, newPrompt]);
      return newPrompt;
    } catch (err) {
      setError('Failed to add prompt');
      return null;
    }
  };

  const updatePrompt = (id, updates) => {
    try {
      const updatedPrompt = promptStorage.update(id, updates);
      if (updatedPrompt) {
        setPrompts(prev => prev.map(p => p.id === id ? updatedPrompt : p));
        return updatedPrompt;
      }
      return null;
    } catch (err) {
      setError('Failed to update prompt');
      return null;
    }
  };

  const deletePrompt = (id) => {
    try {
      promptStorage.delete(id);
      setPrompts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete prompt');
      return false;
    }
  };

  const toggleFavorite = (id) => {
    try {
      const prompt = prompts.find(p => p.id === id);
      if (prompt) {
        return updatePrompt(id, { isFavorite: !prompt.isFavorite });
      }
      return null;
    } catch (err) {
      setError('Failed to toggle favorite');
      return null;
    }
  };

  const incrementUsage = (id) => {
    try {
      promptStorage.incrementUsage(id);
      setPrompts(prev => prev.map(p => 
        p.id === id 
          ? { ...p, usageCount: (p.usageCount || 0) + 1, lastUsed: new Date().toISOString() }
          : p
      ));
    } catch (err) {
      setError('Failed to update usage');
    }
  };

  return {
    prompts,
    loading,
    error,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    incrementUsage,
    setError
  };
};