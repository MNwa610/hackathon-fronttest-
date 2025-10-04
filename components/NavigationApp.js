import React from 'react';
import Header from './Header';
import LeftPanel from './LeftPanel';
import MapPanel from './MapPanel';

const NavigationApp = () => {
  return (
    <div className="container">
      <div className="main-card">
        <Header />
        <div className="main-content">
          <LeftPanel />
          <MapPanel />
        </div>
      </div>
    </div>
  );
};

export default NavigationApp;