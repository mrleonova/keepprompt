import { useState, useEffect } from 'react';
import { settingsStorage } from '../utils/storage';

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect system theme preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Load settings on mount
  useEffect(() => {
    const storedSettings = settingsStorage.get();
    const systemTheme = getSystemTheme();
    
    // If no theme preference stored, use system preference
    const finalSettings = {
      ...storedSettings,
      theme: storedSettings.theme || systemTheme,
      enableKeyboardShortcuts: storedSettings.enableKeyboardShortcuts !== false,
      confirmDelete: storedSettings.confirmDelete !== false,
      showUsageStats: storedSettings.showUsageStats !== false,
    };
    
    setSettings(finalSettings);
    setLoading(false);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', finalSettings.theme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e) => {
        if (settings && !settings.themeOverride) {
          const newTheme = e.matches ? 'dark' : 'light';
          const newSettings = { ...settings, theme: newTheme };
          setSettings(newSettings);
          settingsStorage.save(newSettings);
          document.documentElement.setAttribute('data-theme', newTheme);
        }
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }
  }, [settings]);

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    settingsStorage.save(updated);
    
    // Apply theme immediately if changed
    if (newSettings.theme) {
      document.documentElement.setAttribute('data-theme', newSettings.theme);
    }
  };

  const toggleTheme = () => {
    if (!settings) return;
    
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ 
      theme: newTheme, 
      themeOverride: true // Mark as user override
    });
  };

  return {
    settings,
    loading,
    updateSettings,
    toggleTheme,
  };
};