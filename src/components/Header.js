import React from 'react';
import { Search, Plus, Settings, Moon, Sun, Download, Upload } from 'lucide-react';
import './Header.css';

const Header = ({
  searchTerm,
  onSearchChange,
  onNewPrompt,
  onToggleTheme,
  onExport,
  onImport,
  onOpenSettings,
  theme = 'light'
}) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-icon">📝</span>
            KeepPrompt
          </h1>
        </div>

        <div className="header-center">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="header-right">
          <button
            onClick={onNewPrompt}
            className="btn btn-primary desktop-only"
            title="Create new prompt (Ctrl+N)"
          >
            <Plus size={18} />
            <span className="btn-text">New</span>
          </button>

          <div className="header-actions">
            <button
              onClick={onExport}
              className="btn btn-ghost"
              title="Export data"
            >
              <Download size={18} />
            </button>

            <label className="btn btn-ghost" title="Import data">
              <Upload size={18} />
              <input
                type="file"
                accept=".json"
                onChange={onImport}
                style={{ display: 'none' }}
              />
            </label>

            <button
              onClick={onToggleTheme}
              className="btn btn-ghost"
              title="Toggle theme (Ctrl+T)"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={onOpenSettings}
              className="btn btn-ghost"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;