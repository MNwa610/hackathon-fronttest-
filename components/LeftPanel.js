import React, { useState } from 'react';

const LeftPanel = () => {
  const [activeTransport, setActiveTransport] = useState('walking');

  const transportOptions = [
    { id: 'walking', icon: '🚶', label: 'Пешком' },
    { id: 'car', icon: '🚗', label: 'Машина' }
  ];

  return (
    <div className="left-panel">
      {/* Input Fields */}
      <div className="input-field">
        <div className="input-icon">📍</div>
        <input type="text" placeholder="Откуда" />
      </div>
      
      <div className="input-field">
        <div className="input-icon">📍</div>
        <input type="text" placeholder="Куда" />
      </div>

      {/* Find Route Button */}
      <button className="find-route-btn">
        <span className="btn-icon">🔍</span>
        <span>Найти маршрут</span>
      </button>

      {/* Route Information */}
      <div className="route-info">
        <div className="route-detail">Время: 25мин</div>
        <div className="route-detail">Расстояние: 12 км</div>
      </div>

      {/* Transportation Mode */}
      <div className="transport-modes">
        {transportOptions.map(option => (
          <div 
            key={option.id}
            className={`transport-option ${activeTransport === option.id ? 'active' : ''}`}
            onClick={() => setActiveTransport(option.id)}
          >
            <span className="transport-icon">{option.icon}</span>
            <span>{option.label}</span>
          </div>
        ))}
      </div>

      {/* Start Button */}
      <button className="start-btn">Начать</button>
    </div>
  );
};

export default LeftPanel;