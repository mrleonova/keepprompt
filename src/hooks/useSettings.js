import { useState, useEffect } from 'react';
import { settingsStorage } from '../utils/storage';

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const storedSettings = settingsStorage.get();
    setSettings(storedSettings);
    setLoading(false);
    
    // Apply theme to document
  document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Only dark mode supported
  return {
    settings: { ...settings, theme: 'dark' },
    loading,
    updateSettings: () => {},
    toggleTheme: () => {},
  };
};