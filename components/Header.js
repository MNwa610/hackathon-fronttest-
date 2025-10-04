import React from 'react';

const Header = () => {
  return (
    <div className="header">
      <h1 className="app-title">ИДИСПОКОЙНО</h1>
      <div className="user-controls">
        <div className="control-icon">👤</div>
        <div className="control-icon">🔔</div>
        <div className="control-icon">⚙️</div>
      </div>
    </div>
  );
};

export default Header;