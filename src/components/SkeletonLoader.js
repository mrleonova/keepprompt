import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ variant = 'card', count = 1, className = '' }) => {
  const renderCardSkeleton = () => (
    <div className="skeleton-card">
      <div className="skeleton-card-header">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-actions">
          <div className="skeleton-circle"></div>
          <div className="skeleton-circle"></div>
          <div className="skeleton-circle"></div>
        </div>
      </div>
      <div className="skeleton-line skeleton-description"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-text-1"></div>
        <div className="skeleton-line skeleton-text-2"></div>
        <div className="skeleton-line skeleton-text-3"></div>
      </div>
      <div className="skeleton-card-footer">
        <div className="skeleton-tag"></div>
        <div className="skeleton-stats">
          <div className="skeleton-stat"></div>
          <div className="skeleton-stat"></div>
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="skeleton-list-item">
      <div className="skeleton-line skeleton-list-title"></div>
      <div className="skeleton-line skeleton-list-content"></div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="skeleton-form">
      <div className="skeleton-form-header">
        <div className="skeleton-line skeleton-form-title"></div>
        <div className="skeleton-circle"></div>
      </div>
      <div className="skeleton-form-body">
        <div className="skeleton-form-field">
          <div className="skeleton-line skeleton-label"></div>
          <div className="skeleton-input"></div>
        </div>
        <div className="skeleton-form-field">
          <div className="skeleton-line skeleton-label"></div>
          <div className="skeleton-textarea"></div>
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return renderCardSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'form':
        return renderFormSkeleton();
      default:
        return renderCardSkeleton();
    }
  };

  return (
    <div className={`skeleton-container ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-item">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;