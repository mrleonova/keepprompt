import { useState, useEffect } from 'react';
import { categoryStorage } from '../utils/storage';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load categories on mount
  useEffect(() => {
    try {
      const storedCategories = categoryStorage.getAll();
      setCategories(storedCategories);
      setLoading(false);
    } catch (err) {
      setError('Failed to load categories');
      setLoading(false);
    }
  }, []);

  const addCategory = (categoryData) => {
    try {
      const newCategory = categoryStorage.add(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError('Failed to add category');
      return null;
    }
  };

  const updateCategory = (id, updates) => {
    try {
      const updatedCategory = categoryStorage.update(id, updates);
      if (updatedCategory) {
        setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
        return updatedCategory;
      }
      return null;
    } catch (err) {
      setError('Failed to update category');
      return null;
    }
  };

  const deleteCategory = (id) => {
    try {
      categoryStorage.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete category');
      return false;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    setError
  };
};