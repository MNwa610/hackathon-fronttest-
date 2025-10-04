import React, { useState } from 'react';
import { routingAPI } from '../utils/routingAPI';

const RouteSearch = ({ onRouteFound, routeInfo }) => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!fromLocation.trim() || !toLocation.trim()) {
      alert('Пожалуйста, заполните оба поля');
      return;
    }

    setIsSearching(true);
    
    try {
      // Получаем координаты для адресов через геокодирование
      const [fromCoords, toCoords] = await Promise.all([
        routingAPI.geocodeAddress(fromLocation),
        routingAPI.geocodeAddress(toLocation)
      ]);

      // Создаем точки для маршрута
      const points = [
        {
          id: 1,
          coordinates: fromCoords.coordinates,
          name: fromCoords.name || fromLocation
        },
        {
          id: 2,
          coordinates: toCoords.coordinates,
          name: toCoords.name || toLocation
        }
      ];

      // Получаем маршрут между точками
      const routeData = await routingAPI.getRoute(points, 'walking');
      
      const route = {
        from: fromLocation,
        to: toLocation,
        duration: `${Math.round(routeData.duration/60)}мин`,
        distance: `${Math.round(routeData.distance/1000)} км`,
        coordinates: {
          from: fromCoords.coordinates,
          to: toCoords.coordinates
        },
        routeCoordinates: routeData.coordinates
      };
      
      onRouteFound(route);
      setIsSearching(false);
      
    } catch (error) {
      console.error('Ошибка при поиске маршрута:', error);
      alert('Ошибка при поиске маршрута. Проверьте правильность адресов.');
      setIsSearching(false);
    }
  };

  return (
    <div className="left-panel">
      {/* Input Fields */}
      <div className="input-field">
        <div className="input-icon">📍</div>
        <input 
          type="text" 
          placeholder="Откуда"
          value={fromLocation}
          onChange={(e) => setFromLocation(e.target.value)}
        />
      </div>
      
      <div className="input-field">
        <div className="input-icon">📍</div>
        <input 
          type="text" 
          placeholder="Куда"
          value={toLocation}
          onChange={(e) => setToLocation(e.target.value)}
        />
      </div>

      {/* Find Route Button */}
      <button 
        className="find-route-btn"
        onClick={handleSearch}
        disabled={isSearching}
      >
        <span className="btn-icon">🔍</span>
        <span>{isSearching ? 'Поиск...' : 'Найти маршрут'}</span>
      </button>

      {/* Route Information */}
      <div className="route-info">
        <div className="route-detail">
          Время: {routeInfo?.duration || '25мин'}
        </div>
        <div className="route-detail">
          Расстояние: {routeInfo?.distance || '12 км'}
        </div>
      </div>

      {/* Transportation Mode */}
      <div className="transport-modes">
        <div className="transport-option active">
          <span className="transport-icon">🚶</span>
          <span>Пешком</span>
        </div>
      </div>

      {/* Start Button */}
      <button className="start-btn">Начать</button>
    </div>
  );
};

export default RouteSearch;
