import * as Location from 'expo-location';

export interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
  iconUrl?: string;
  isLoading?: boolean;
  error?: string | null;
}

export interface WeatherForecast {
  date: string;
  temperature: number;
  condition: string;
  iconUrl: string;
}

class WeatherService {
  private readonly API_KEY = '2547a3b49c3a078a2821ac9c30a53f4e';
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  /**
   * Get current weather for given coordinates
   */
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      console.log(`🌤️ Fetching weather for coordinates: ${lat}, ${lon}`);

      const apiUrl = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`;

      console.log('🌤️ Weather API URL:', apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🌤️ Weather API error:', errorText);
        throw new Error(`Weather API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('🌤️ Weather data received:', data);

      // Map OpenWeatherMap data to our interface
      const weatherData: WeatherData = {
        location: data.name || 'Unknown Location',
        temperature: Math.round(data.main.temp),
        condition: this.mapWeatherCondition(data.weather[0].main),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        isLoading: false,
        error: null
      };

      console.log('🌤️ Processed weather data:', weatherData);
      return weatherData;

    } catch (error) {
      console.error('🌤️ Weather service error:', error);

      // Return fallback data
      return {
        location: 'Unknown',
        temperature: 0,
        condition: 'Not available',
        humidity: 0,
        windSpeed: 0,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown weather error'
      };
    }
  }

  /**
   * Get weather forecast for given coordinates
   */
  async getWeatherForecast(lat: number, lon: number, days: number = 5): Promise<WeatherForecast[]> {
    try {
      console.log(`🌤️ Fetching ${days}-day forecast for coordinates: ${lat}, ${lon}`);

      const apiUrl = `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.API_KEY}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();

      // Process forecast data (API returns 3-hour intervals)
      const dailyForecasts: { [date: string]: any[] } = {};

      data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();

        if (!dailyForecasts[date]) {
          dailyForecasts[date] = [];
        }

        dailyForecasts[date].push(item);
      });

      // Take first forecast for each day
      const forecasts: WeatherForecast[] = Object.keys(dailyForecasts)
        .slice(0, days)
        .map(date => {
          const dayData = dailyForecasts[date][0]; // Take midday forecast
          return {
            date: date,
            temperature: Math.round(dayData.main.temp),
            condition: this.mapWeatherCondition(dayData.weather[0].main),
            iconUrl: `https://openweathermap.org/img/wn/${dayData.weather[0].icon}.png`
          };
        });

      console.log('🌤️ Weather forecast processed:', forecasts);
      return forecasts;

    } catch (error) {
      console.error('🌤️ Forecast service error:', error);
      return [];
    }
  }

  /**
   * Get weather using current device location
   */
  async getCurrentLocationWeather(): Promise<WeatherData> {
    try {
      console.log('🌤️ Getting current location for weather...');

      // Check location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        throw new Error('Location permission not granted');
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      console.log('🌤️ Current location:', { latitude, longitude });

      return await this.getCurrentWeather(latitude, longitude);

    } catch (error) {
      console.error('🌤️ Location weather error:', error);

      // Return fallback data
      return {
        location: 'Current Location',
        temperature: 0,
        condition: 'Location unavailable',
        humidity: 0,
        windSpeed: 0,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Location error'
      };
    }
  }

  /**
   * Map OpenWeatherMap conditions to our app conditions
   */
  private mapWeatherCondition(apiCondition: string): string {
    const conditionMap: { [key: string]: string } = {
      'Clear': 'Clear',
      'Clouds': 'Cloudy',
      'Rain': 'Rain',
      'Drizzle': 'Rain',
      'Thunderstorm': 'Thunderstorm',
      'Snow': 'Snow',
      'Mist': 'Fog',
      'Fog': 'Fog',
      'Haze': 'Fog'
    };

    return conditionMap[apiCondition] || 'Partly Cloudy';
  }

  /**
   * Get weather icon name for Ionicons (static method)
   */
  static getWeatherIcon(condition: string): string {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'sunny-outline';
      case 'cloudy':
      case 'clouds':
        return 'cloud-outline';
      case 'rain':
      case 'drizzle':
        return 'rainy-outline';
      case 'thunderstorm':
        return 'thunderstorm-outline';
      case 'snow':
        return 'snow-outline';
      case 'fog':
      case 'mist':
      case 'haze':
        return 'cloud-outline';
      default:
        return 'partly-sunny-outline';
    }
  }

  /**
   * Get weather icon name for Ionicons (instance method)
   */
  getWeatherIcon(condition: string): string {
    return WeatherService.getWeatherIcon(condition);
  }
}

export const weatherService = new WeatherService();
export default weatherService;
