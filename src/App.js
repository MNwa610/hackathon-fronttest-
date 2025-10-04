import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import RouteSearch from './components/RouteSearch';

function App() {
  const [routeData, setRouteData] = useState(null);
  const [mapPoints, setMapPoints] = useState([]);

  const handleRouteFound = (route) => {
    setRouteData(route);
  };

  const handlePointsChange = (points) => {
    setMapPoints(points);
  };

  return (
    <div className="container">
      <div className="main-card">
        {/* Header */}
        <div className="header">
          <h1 className="app-title">ИДИСПОКОЙНО</h1>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Left Panel */}
          <RouteSearch onRouteFound={handleRouteFound} routeInfo={routeData} />

          {/* Right Panel - Map */}
          <div className="right-panel">
            <Map routeData={routeData} onPointsChange={handlePointsChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
