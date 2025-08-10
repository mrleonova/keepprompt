import { useState, useEffect, useCallback } from 'react';
import { searchPrompts, sortPrompts } from '../utils/helpers';

export const useSearch = (prompts, initialSearchTerm = '', initialCategory = 'all', initialSortBy = 'updatedAt') => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filteredPrompts, setFilteredPrompts] = useState([]);

  // Debounced search function
  const debouncedSearch = useCallback((term, category, prompts, sort, order) => {
    const searched = searchPrompts(prompts, term, category);
    const sorted = sortPrompts(searched, sort, order);
    setFilteredPrompts(sorted);
  }, []);

  // Update filtered prompts when dependencies change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchTerm, categoryFilter, prompts, sortBy, sortOrder);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoryFilter, prompts, sortBy, sortOrder, debouncedSearch]);

  const updateSearchTerm = (term) => {
    setSearchTerm(term);
  };

  const updateCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  const updateSort = (field, order = sortOrder) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setSortBy('updatedAt');
    setSortOrder('desc');
  };

  return {
    searchTerm,
    categoryFilter,
    sortBy,
    sortOrder,
    filteredPrompts,
    updateSearchTerm,
    updateCategoryFilter,
    updateSort,
    toggleSortOrder,
    clearSearch
  };
};