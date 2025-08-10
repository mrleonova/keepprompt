import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts = {}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only process shortcuts if not typing in an input/textarea
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

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