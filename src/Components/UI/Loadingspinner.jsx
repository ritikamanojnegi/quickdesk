// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ small = false }) => {
  return (
    <div className={`loading-spinner ${small ? 'small' : ''}`}>
      <div className="spinner"></div>
      {!small && <p>Loading...</p>}
    </div>
  );
};

export default LoadingSpinner;