import React, { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';
import { routingAPI } from '../utils/routingAPI';

const Map = ({ routeData, onPointsChange }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const routeLineRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isAddingPoints, setIsAddingPoints] = useState(false);

  useEffect(() => {
    const initMap = async () => {
      try {
        // Загружаем MapGL API
        const mapgl = await load();
        
        // Инициализируем карту
        mapInstance.current = new mapgl.Map(mapContainer.current, {
          center: [55.31878, 25.23584], // Координаты по умолчанию
          zoom: 13,
          key: 'a56ee526-deb2-4819-b1c5-e92947d547cc', // Замените на ваш ключ
        });

        // Добавляем маркер по умолчанию
        const defaultMarker = new mapgl.Marker(mapInstance.current, {
          coordinates: [55.752371, 37.618752],
        });
        markersRef.current.push(defaultMarker);

        // Добавляем обработчик кликов по карте
        const handleMapClick = (event) => {
          if (isAddingPoints) {
            addPoint(event.lngLat);
          }
        };
        
        mapInstance.current.on('click', handleMapClick);

      } catch (error) {
        console.error('Ошибка при загрузке карты:', error);
      }
    };

    initMap();

    // Очистка при размонтировании компонента
    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  // Обновляем обработчик кликов при изменении состояния isAddingPoints
  useEffect(() => {
    if (mapInstance.current) {
      // Удаляем предыдущий обработчик
      mapInstance.current.off('click');
      
      // Добавляем новый обработчик
      const handleMapClick = (event) => {
        if (isAddingPoints) {
          addPoint(event.lngLat);
        }
      };
      
      mapInstance.current.on('click', handleMapClick);
    }
  }, [isAddingPoints]);

  // Обработчик изменения размера окна для обновления карты
  useEffect(() => {
    const handleResize = () => {
      // Небольшая задержка для корректного обновления
      setTimeout(() => {
        updateMapSize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  // Функция добавления точки
  const addPoint = (coordinates) => {
    const newPoint = {
      id: Date.now(),
      coordinates: [coordinates.lng, coordinates.lat],
      name: `Точка ${points.length + 1}`
    };
    
    const updatedPoints = [...points, newPoint];
    setPoints(updatedPoints);
    
    // Добавляем маркер на карту
    if (mapInstance.current) {
      const mapgl = window.mapgl || mapInstance.current._mapgl;
      if (mapgl) {
        const marker = new mapgl.Marker(mapInstance.current, {
          coordinates: newPoint.coordinates,
          icon: '📍',
        });
        markersRef.current.push(marker);
      }
    }
    
    // Перемещаем карту к новой точке
    if (mapInstance.current) {
      mapInstance.current.setCenter([coordinates.lat, coordinates.lng]);
    }
    
    // Уведомляем родительский компонент
    if (onPointsChange) {
      onPointsChange(updatedPoints);
    }
    
    // Если есть 2 или больше точек, строим маршрут
    if (updatedPoints.length >= 2) {
      buildRoute(updatedPoints);
    }
  };

  // Функция перемещения карты к выбранной точке
  const moveToPoint = (point) => {
    if (mapInstance.current) {
      mapInstance.current.setCenter([point.coordinates[0], point.coordinates[1]]);
    }
  };

  // Функция удаления точки
  const removePoint = (pointId) => {
    const updatedPoints = points.filter(point => point.id !== pointId);
    setPoints(updatedPoints);
    
    // Удаляем маркер с карты
    const markerIndex = points.findIndex(point => point.id === pointId);
    if (markerIndex !== -1 && markersRef.current[markerIndex]) {
      markersRef.current[markerIndex].destroy();
      markersRef.current.splice(markerIndex, 1);
    }
    
    // Уведомляем родительский компонент
    if (onPointsChange) {
      onPointsChange(updatedPoints);
    }
    
    // Перестраиваем маршрут если остались точки
    if (updatedPoints.length >= 2) {
      buildRoute(updatedPoints);
    } else {
      // Удаляем маршрут если точек меньше 2
      if (routeLineRef.current) {
        routeLineRef.current.destroy();
        routeLineRef.current = null;
      }
    }
  };

  // Функция построения маршрута
  const buildRoute = async (pointsToRoute) => {
    if (pointsToRoute.length < 2) return;
    
    try {
      // Получаем маршрут через 2GIS Routing API
      const routeData = await routingAPI.getRoute(pointsToRoute, 'walking');
      
      if (mapInstance.current) {
        const mapgl = window.mapgl || mapInstance.current._mapgl;
        if (mapgl) {
          // Удаляем предыдущий маршрут
          if (routeLineRef.current) {
            routeLineRef.current.destroy();
          }
          
          // Создаем линию маршрута с реальными координатами
          routeLineRef.current = new mapgl.Polyline(mapInstance.current, {
            coordinates: routeData.coordinates,
            color: '#66bb6a',
            width: 4,
          });

          // Обновляем информацию о маршруте
          console.log(`Маршрут построен: ${routeData.distance}м, ${Math.round(routeData.duration/60)}мин`);
        }
      }
    } catch (error) {
      console.error('Ошибка при построении маршрута:', error);
      
      // Fallback: создаем прямую линию между точками
      const coordinates = pointsToRoute.map(point => point.coordinates);
      
      if (mapInstance.current) {
        const mapgl = window.mapgl || mapInstance.current._mapgl;
        if (mapgl) {
          if (routeLineRef.current) {
            routeLineRef.current.destroy();
          }
          
          routeLineRef.current = new mapgl.Polyline(mapInstance.current, {
            coordinates: coordinates,
            color: '#ff6b6b',
            width: 4,
          });
        }
      }
    }
  };

  // Обновляем карту при изменении данных маршрута
  useEffect(() => {
    if (routeData && mapInstance.current) {
      // Очищаем предыдущие маркеры
      markersRef.current.forEach(marker => marker.destroy());
      markersRef.current = [];

      // Добавляем новые маркеры для маршрута
      const mapgl = window.mapgl || mapInstance.current._mapgl;
      if (mapgl) {
        // Маркер начала маршрута
        const startMarker = new mapgl.Marker(mapInstance.current, {
          coordinates: routeData.coordinates.from,
          icon: '📍',
        });
        markersRef.current.push(startMarker);

        // Маркер конца маршрута
        const endMarker = new mapgl.Marker(mapInstance.current, {
          coordinates: routeData.coordinates.to,
          icon: '🏁',
        });
        markersRef.current.push(endMarker);

        // Центрируем карту на маршруте
        const centerLat = (routeData.coordinates.from[0] + routeData.coordinates.to[0]) / 2;
        const centerLng = (routeData.coordinates.from[1] + routeData.coordinates.to[1]) / 2;
        mapInstance.current.setCenter([centerLat, centerLng]);
      }
    }
  }, [routeData]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
      

      {/* Points Controls */}
      <div className="points-controls">
        <button 
          className={`points-btn ${isAddingPoints ? 'active' : ''}`}
          onClick={() => setIsAddingPoints(!isAddingPoints)}
        >
          {isAddingPoints ? 'Отменить' : 'Добавить точки'}
        </button>
        
        {isAddingPoints && (
          <div className="points-hint">
            Кликните по карте для добавления точки
          </div>
        )}
        
        {points.length > 0 && (
          <button 
            className="clear-btn"
            onClick={() => {
              setPoints([]);
              markersRef.current.forEach(marker => marker.destroy());
              markersRef.current = [];
              if (routeLineRef.current) {
                routeLineRef.current.destroy();
                routeLineRef.current = null;
              }
              if (onPointsChange) {
                onPointsChange([]);
              }
            }}
          >
            Очистить все
          </button>
        )}
      </div>

      {/* Points List */}
      {points.length > 0 && (
        <div className="points-list">
          <h4>Точки маршрута:</h4>
          {points.map((point, index) => (
            <div key={point.id} className="point-item">
              <span className="point-number">{index + 1}</span>
              <span 
                className="point-name clickable"
                onClick={() => moveToPoint(point)}
                title="Кликните для перемещения к точке"
              >
                {point.name}
              </span>
              <button 
                className="remove-point-btn"
                onClick={() => removePoint(point.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Map;
