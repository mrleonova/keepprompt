import { useState, useEffect, useCallback } from 'react';
import { searchPrompts, sortPrompts } from '../utils/helpers';

export const useSearch = (prompts, initialSearchTerm = '', initialSortBy = 'updatedAt') => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filteredPrompts, setFilteredPrompts] = useState([]);

  // Debounced search function
  const debouncedSearch = useCallback((term, prompts, sort, order) => {
    const searched = searchPrompts(prompts, term);
    const sorted = sortPrompts(searched, sort, order);
    setFilteredPrompts(sorted);
  }, []);

  // Update filtered prompts when dependencies change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchTerm, prompts, sortBy, sortOrder);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, prompts, sortBy, sortOrder, debouncedSearch]);

  const updateSearchTerm = (term) => {
    setSearchTerm(term);
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
    setSortBy('updatedAt');
    setSortOrder('desc');
  };

  return {
    searchTerm,
    sortBy,
    sortOrder,
    filteredPrompts,
    updateSearchTerm,
    updateSort,
    toggleSortOrder,
    clearSearch
  };
};