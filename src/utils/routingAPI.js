// Утилиты для работы с 2GIS Routing API
export const routingAPI = {
  // Получение маршрута между точками
  async getRoute(points, transportMode = 'walking') {
    if (points.length < 2) {
      throw new Error('Необходимо минимум 2 точки для построения маршрута');
    }

    try {
      // Формируем координаты для запроса
      const coordinates = points.map(point => point.coordinates);
      
      // Определяем тип транспорта для API
      const profile = transportMode === 'walking' ? 'pedestrian' : 'car';
      
      // URL для 2GIS Routing API
      const apiUrl = `https://routing.api.2gis.com/carrouting/6.0.0/global?key=a56ee526-deb2-4819-b1c5-e92947d547cc`;
      
      // Параметры запроса
      const requestBody = {
        points: coordinates.map(coord => ({
          type: 'stop',
          lon: coord[1], // долгота
          lat: coord[0]   // широта
        })),
        type: profile,
        locale: 'ru_RU'
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.status}`);
      }

      const data = await response.json();
      
      // Обрабатываем ответ API
      if (data.result && data.result.length > 0) {
        const route = data.result[0];
        return {
          coordinates: route.geometry.coordinates.map(coord => [coord[1], coord[0]]), // [lat, lng]
          distance: route.total_distance,
          duration: route.total_duration,
          legs: route.legs
        };
      } else {
        throw new Error('Маршрут не найден');
      }
      
    } catch (error) {
      console.error('Ошибка при получении маршрута:', error);
      throw error;
    }
  },

  // Получение геокодирования адреса
  async geocodeAddress(address) {
    try {
      const apiUrl = `https://catalog.api.2gis.com/3.0/items/geocode?q=${encodeURIComponent(address)}&key=a56ee526-deb2-4819-b1c5-e92947d547cc`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Ошибка геокодирования: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.result && data.result.items && data.result.items.length > 0) {
        const item = data.result.items[0];
        return {
          coordinates: [item.point.lat, item.point.lon],
          address: item.full_name,
          name: item.name
        };
      } else {
        throw new Error('Адрес не найден');
      }
      
    } catch (error) {
      console.error('Ошибка при геокодировании:', error);
      throw error;
    }
  }
};
