import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't process shortcuts if typing in an input/textarea (except for specific shortcuts)
      const isInputField = event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA';
      const key = event.key.toLowerCase();
      const isCtrl = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;
      const isAlt = event.altKey;

      // Build shortcut key combination
      let shortcutKey = '';
      if (isCtrl) shortcutKey += 'ctrl+';
      if (isAlt) shortcutKey += 'alt+';
      if (isShift) shortcutKey += 'shift+';
      shortcutKey += key;

      // Special handling for search shortcut (Ctrl+K) - works even in input fields
      if (shortcutKey === 'ctrl+k' && shortcuts['ctrl+k']) {
        event.preventDefault();
        shortcuts['ctrl+k']();
        return;
      }

      // For other shortcuts, skip if in input field
      if (isInputField) {
        return;
      }

      // Single key shortcuts (when not in input)
      if (!isCtrl && !isAlt && !isShift) {
        const singleKeyShortcuts = {
          'n': 'new',
          'e': 'edit', 
          'd': 'delete',
          '?': 'help',
          '/': 'search',
        };
        
        if (singleKeyShortcuts[key] && shortcuts[singleKeyShortcuts[key]]) {
          event.preventDefault();
          shortcuts[singleKeyShortcuts[key]]();
          return;
        }
      }

      // Execute shortcut if it exists
      if (shortcuts[shortcutKey]) {
        event.preventDefault();
        shortcuts[shortcutKey]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};