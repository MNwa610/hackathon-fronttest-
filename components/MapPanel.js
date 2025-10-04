import React from 'react';

const MapPanel = () => {
  return (
    <div className="right-panel">
      <div className="map-container">
        {/* Map Content */}
        <div className="map">
          {/* Roads */}
          <div className="road horizontal road-1"></div>
          <div className="road horizontal road-2"></div>
          <div className="road horizontal road-3"></div>
          <div className="road vertical road-4"></div>
          <div className="road vertical road-5"></div>
          <div className="road vertical road-6"></div>
          
          {/* Parks/Blocks */}
          <div className="park park-1"></div>
          <div className="park park-2"></div>
          <div className="park park-3"></div>
          <div className="park park-4"></div>
          <div className="park park-5"></div>
          <div className="park park-6"></div>
          
          {/* River */}
          <div className="river"></div>
          
          {/* Bridges */}
          <div className="bridge bridge-1"></div>
          <div className="bridge bridge-2"></div>
        </div>

        {/* Map Controls */}
        <div className="map-controls">
          <div className="fullscreen-btn">⛶</div>
          <div className="zoom-controls">
            <div className="zoom-btn">+</div>
            <div className="zoom-btn">-</div>
            <div className="zoom-btn">📍</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;