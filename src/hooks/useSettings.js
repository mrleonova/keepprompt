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
    document.documentElement.setAttribute('data-theme', storedSettings.theme);
  }, []);

  const updateSettings = (updates) => {
    const newSettings = settingsStorage.update(updates);
    setSettings(newSettings);
    
    // Apply theme changes immediately
    if (updates.theme) {
      document.documentElement.setAttribute('data-theme', updates.theme);
    }
    
    return newSettings;
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    return updateSettings({ theme: newTheme });
  };

  return {
    settings,
    loading,
    updateSettings,
    toggleTheme
  };
};