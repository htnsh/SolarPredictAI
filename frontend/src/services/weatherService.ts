// Weather API service for fetching weather data (WeatherAPI.com)
export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  city: string;
  solarIrradiance: number;
  cloudCover: number;
}

export interface WeatherError {
  message: string;
  code?: string;
}

class WeatherService {
  private apiKey: string = "041bfe338514476fb6b152940250409";
  private baseUrl: string = "http://api.weatherapi.com/v1/current.json";

  /**
   * Fetch weather data for a given city using WeatherAPI.com
   * @param city - City name (e.g., "London", "New York")
   * @returns Promise<WeatherData | WeatherError>
   */
  async getWeatherByCity(city: string): Promise<WeatherData | WeatherError> {
    if (!city.trim()) {
      return { message: "Please enter a valid city name.", code: "INVALID_CITY" };
    }

    try {
      const url = `${this.baseUrl}?key=${this.apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 400) {
          return { message: "City not found. Please check the spelling and try again.", code: "CITY_NOT_FOUND" };
        } else if (response.status === 401) {
          return { message: "Invalid API key. Please check your weather API key.", code: "INVALID_API_KEY" };
        } else {
          return { message: `Weather service error: ${response.status} ${response.statusText}`, code: "API_ERROR" };
        }
      }

      const data = await response.json();

      return {
        temperature: Math.round(data.current.temp_c * 10) / 10,
        humidity: Math.round(data.current.humidity),
        windSpeed: Math.round((data.current.wind_kph / 3.6) * 10) / 10, // km/h → m/s
        description: data.current.condition.text,
        city: data.location.name,
        solarIrradiance: this.estimateSolarIrradianceFromWeather(data.current),
        cloudCover: data.current.cloud,
      };
    } catch (error) {
      console.error("Weather API Error:", error);
      return { message: "Failed to fetch weather data. Please check your internet connection.", code: "NETWORK_ERROR" };
    }
  }

  private estimateSolarIrradianceFromWeather(current: any): number {
    if (current.short_rad && current.short_rad > 0) return Math.round(current.short_rad);

    const cloudCover = current.cloud;
    const isDay = current.is_day === 1;
    if (!isDay) return 0;

    const baseIrradiance = 800; // Clear sky irradiance
    const cloudFactor = (100 - cloudCover) / 100;
    return Math.round(baseIrradiance * cloudFactor);
  }

  mapWeatherToCloudCover(description: string, cloudCover: number = 50): string {
    if (cloudCover <= 10) return "Fluffy white clouds";
    else if (cloudCover <= 30) return "Thin high clouds";
    else if (cloudCover <= 60) return "Mid-level clouds";
    else return "Thick low clouds";
  }

  estimateSolarIrradiance(description: string, temperature: number): number {
    const desc = description.toLowerCase();
    if (desc.includes("clear") || desc.includes("sunny")) return 800;
    if (desc.includes("few clouds") || desc.includes("scattered clouds")) return 600;
    if (desc.includes("broken clouds") || desc.includes("partly cloudy")) return 400;
    if (desc.includes("overcast") || desc.includes("cloudy")) return 200;
    if (desc.includes("storm") || desc.includes("thunderstorm")) return 100;
    return 500;
  }
}

export const weatherService = new WeatherService();
