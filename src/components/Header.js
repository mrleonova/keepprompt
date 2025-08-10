import React from 'react';
import { Search, Plus, Settings, Download, Upload } from 'lucide-react';
import './Header.css';

const Header = ({
  searchTerm,
  onSearchChange,
  onNewPrompt,
  // ...existing code...
  onExport,
  onImport,
  onOpenSettings,
  // ...existing code...
}) => {
  return (
    <header className="header" role="banner">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo" id="app-title">
            <span className="logo-icon" role="img" aria-label="Document icon">📝</span>
            KeepPrompt
          </h1>
        </div>

        <div className="header-center">
          <div className="search-container" role="search">
            <Search className="search-icon" size={20} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
              aria-label="Search prompts by title, content, or tags"
              aria-describedby="search-help"
            />
            <div id="search-help" className="sr-only">
              Use Ctrl+K or Ctrl+F to focus this search field
            </div>
          </div>
        </div>

        <div className="header-right">
          <nav className="main-navigation" role="navigation" aria-label="Main actions">
            <button
              onClick={onNewPrompt}
              className="btn btn-primary"
              title="Create new prompt (Ctrl+N)"
              aria-label="Create new prompt"
              aria-keyshortcuts="Control+n"
            >
              <Plus size={18} aria-hidden="true" />
              <span className="btn-text">New</span>
            </button>

            <div className="header-actions" role="group" aria-label="Data management actions">
              <button
                onClick={onExport}
                className="btn btn-ghost"
                title="Export data"
                aria-label="Export all prompts as JSON file"
              >
                <Download size={18} aria-hidden="true" />
                <span className="sr-only">Export</span>
              </button>

              <label className="btn btn-ghost" title="Import data">
                <Upload size={18} aria-hidden="true" />
                <span className="sr-only">Import prompts from JSON file</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImport}
                  style={{ display: 'none' }}
                  aria-label="Select JSON file to import prompts"
                />
              </label>

              <button
                onClick={onOpenSettings}
                className="btn btn-ghost"
                title="Settings"
                aria-label="Open application settings"
              >
                <Settings size={18} aria-hidden="true" />
                <span className="sr-only">Settings</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;