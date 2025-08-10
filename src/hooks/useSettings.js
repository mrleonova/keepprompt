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
    document.documentElement.setAttribute('data-theme', storedSettings?.theme || 'dark');
  }, []);

  const updateSettings = (updates) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    settingsStorage.save(newSettings);
    
    // Apply theme change immediately
    if (updates.theme) {
      document.documentElement.setAttribute('data-theme', updates.theme);
    }
    
    return newSettings;
  };

  const toggleTheme = () => {
    const newTheme = settings?.theme === 'dark' ? 'light' : 'dark';
    return updateSettings({ theme: newTheme });
  };

  return {
    settings,
    loading,
    updateSettings,
    toggleTheme,
  };
};