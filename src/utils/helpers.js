// Utility functions for KeepPrompt

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  if (!text) return false;
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch (error) {
    return 'Invalid date';
  }
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Search/filter prompts
export const searchPrompts = (prompts, searchTerm, categoryFilter = null) => {
  if (!prompts || prompts.length === 0) return [];
  
  let filtered = [...prompts];
  
  // Filter by category
  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter(prompt => 
      prompt.category === categoryFilter || 
      (prompt.tags && prompt.tags.includes(categoryFilter))
    );
  }
  
  // Search by term
  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    filtered = filtered.filter(prompt => 
      prompt.title.toLowerCase().includes(term) ||
      prompt.description.toLowerCase().includes(term) ||
      prompt.content.toLowerCase().includes(term) ||
      (prompt.tags && prompt.tags.some(tag => 
        tag.toLowerCase().includes(term)
      ))
    );
  }
  
  return filtered;
};

// Sort prompts
export const sortPrompts = (prompts, sortBy = 'updatedAt', sortOrder = 'desc') => {
  if (!prompts || prompts.length === 0) return [];
  
  const sorted = [...prompts].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'title':
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case 'createdAt':
      case 'updatedAt':
        valueA = new Date(a[sortBy] || 0);
        valueB = new Date(b[sortBy] || 0);
        break;
      case 'usageCount':
        valueA = a.usageCount || 0;
        valueB = b.usageCount || 0;
        break;
      case 'lastUsed':
        valueA = new Date(a.lastUsed || 0);
        valueB = new Date(b.lastUsed || 0);
        break;
      default:
        valueA = a.updatedAt;
        valueB = b.updatedAt;
    }
    
    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });
  
  return sorted;
};

// Validate prompt data
export const validatePrompt = (prompt) => {
  const errors = [];
  
  if (!prompt.title || prompt.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (prompt.title.trim().length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (!prompt.content || prompt.content.trim().length === 0) {
    errors.push('Content is required');
  } else if (prompt.content.trim().length > 10000) {
    errors.push('Content must be less than 10,000 characters');
  }
  
  if (prompt.description && prompt.description.length > 300) {
    errors.push('Description must be less than 300 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate prompt templates
export const generateTemplate = (type) => {
  const templates = {
    basic: {
      title: 'New Prompt',
      description: 'A basic prompt template',
      content: 'Please help me with...',
      category: 'general',
      tags: []
    },
    
    codeReview: {
      title: 'Code Review',
      description: 'Template for code review requests',
      content: 'Please review this code and provide feedback on:\n- Code quality and best practices\n- Potential bugs or issues\n- Performance improvements\n- Readability and maintainability\n\n```\n[paste your code here]\n```',
      category: 'coding',
      tags: ['code-review', 'programming']
    },
    
    writing: {
      title: 'Writing Assistant',
      description: 'Template for writing assistance',
      content: 'Please help me improve this text by:\n- Correcting grammar and spelling\n- Improving clarity and flow\n- Enhancing tone and style\n- Suggesting better word choices\n\n[paste your text here]',
      category: 'writing',
      tags: ['writing', 'editing', 'grammar']
    },
    
    analysis: {
      title: 'Data Analysis',
      description: 'Template for data analysis requests',
      content: 'Please analyze this data and provide:\n- Key insights and patterns\n- Statistical summary\n- Trends and anomalies\n- Recommendations based on findings\n\n[paste your data here]',
      category: 'analysis',
      tags: ['data', 'analysis', 'insights']
    },
    
    creative: {
      title: 'Creative Writing',
      description: 'Template for creative writing prompts',
      content: 'Write a creative piece about:\n- Setting: [describe the setting]\n- Character: [describe main character]\n- Conflict: [describe the main conflict]\n- Style: [specify writing style or genre]\n\nAdditional requirements:\n[add any specific requirements]',
      category: 'creative',
      tags: ['creative', 'writing', 'story']
    }
  };
  
  return templates[type] || templates.basic;
};

// Export data as file
export const downloadData = (data, filename = 'keepprompt-backup.json') => {
  try {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
};

// Debounce function for search input
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};