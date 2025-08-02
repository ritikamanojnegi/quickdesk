import React, { useEffect } from 'react';

const Notification = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
      <button onClick={onClose} className="close-btn">
        &times;
      </button>
    </div>
  );
};

export default Notification;