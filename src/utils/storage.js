// Local storage utilities for KeepPrompt

const STORAGE_KEYS = {
  PROMPTS: 'keepprompt_prompts',
  CATEGORIES: 'keepprompt_categories',
  SETTINGS: 'keepprompt_settings',
  TEMPLATES: 'keepprompt_templates'
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generic storage operations
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to storage:', error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from storage:', error);
      return false;
    }
  }
};

// Prompt-specific operations
export const promptStorage = {
  getAll: () => storage.get(STORAGE_KEYS.PROMPTS) || [],
  
  save: (prompts) => storage.set(STORAGE_KEYS.PROMPTS, prompts),
  
  add: (prompt) => {
    const prompts = promptStorage.getAll();
    const newPrompt = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      isFavorite: false,
      ...prompt
    };
    prompts.push(newPrompt);
    promptStorage.save(prompts);
    return newPrompt;
  },
  
  update: (id, updates) => {
    const prompts = promptStorage.getAll();
    const index = prompts.findIndex(p => p.id === id);
    if (index !== -1) {
      prompts[index] = {
        ...prompts[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      promptStorage.save(prompts);
      return prompts[index];
    }
    return null;
  },
  
  delete: (id) => {
    const prompts = promptStorage.getAll();
    const filtered = prompts.filter(p => p.id !== id);
    promptStorage.save(filtered);
    return filtered;
  },

  incrementUsage: (id) => {
    const prompts = promptStorage.getAll();
    const prompt = prompts.find(p => p.id === id);
    if (prompt) {
      prompt.usageCount = (prompt.usageCount || 0) + 1;
      prompt.lastUsed = new Date().toISOString();
      promptStorage.save(prompts);
    }
  }
};

// Category-specific operations
export const categoryStorage = {
  getAll: () => storage.get(STORAGE_KEYS.CATEGORIES) || [
    { id: 'general', name: 'General', color: '#6b7280' },
    { id: 'coding', name: 'Coding', color: '#059669' },
    { id: 'writing', name: 'Writing', color: '#7c3aed' },
    { id: 'analysis', name: 'Analysis', color: '#dc2626' },
    { id: 'creative', name: 'Creative', color: '#ea580c' }
  ],
  
  save: (categories) => storage.set(STORAGE_KEYS.CATEGORIES, categories),
  
  add: (category) => {
    const categories = categoryStorage.getAll();
    const newCategory = {
      id: generateId(),
      color: '#6b7280',
      ...category
    };
    categories.push(newCategory);
    categoryStorage.save(categories);
    return newCategory;
  },
  
  update: (id, updates) => {
    const categories = categoryStorage.getAll();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      categoryStorage.save(categories);
      return categories[index];
    }
    return null;
  },
  
  delete: (id) => {
    const categories = categoryStorage.getAll();
    const filtered = categories.filter(c => c.id !== id);
    categoryStorage.save(filtered);
    return filtered;
  }
};

// Settings operations
export const settingsStorage = {
  get: () => storage.get(STORAGE_KEYS.SETTINGS) || {
    theme: 'dark',
    defaultCategory: 'general',
    showUsageStats: true,
    enableKeyboardShortcuts: true,
    confirmDelete: true
  },
  
  save: (settings) => storage.set(STORAGE_KEYS.SETTINGS, settings),
  
  update: (updates) => {
    const currentSettings = settingsStorage.get();
    const newSettings = { ...currentSettings, ...updates };
    settingsStorage.save(newSettings);
    return newSettings;
  }
};

// Import/Export functionality
export const dataManager = {
  export: () => {
    const data = {
      prompts: promptStorage.getAll(),
      categories: categoryStorage.getAll(),
      settings: settingsStorage.get(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  },
  
  import: (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.prompts) {
        promptStorage.save(data.prompts);
      }
      
      if (data.categories) {
        categoryStorage.save(data.categories);
      }
      
      if (data.settings) {
        settingsStorage.save(data.settings);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },
  
  clear: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.remove(key);
    });
  }
};