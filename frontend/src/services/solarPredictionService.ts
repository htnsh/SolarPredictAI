// Solar Prediction API service
export interface SolarPredictionRequest {
  panel_area: number;
  tilt: number;
  azimuth: number;
  ghi: number;
  dni: number;
  temperature: number;
  humidity: number;
  wind_speed: number;
  cloud_cover: string;
}

export interface SolarPredictionResponse {
  predicted_power_generated: number;
  input_parameters: SolarPredictionRequest;
  model_info: {
    model_type: string;
    prediction_units: string;
    dataset_source: string;
  };
}

export interface SolarPredictionError {
  message: string;
  code?: string;
}

class SolarPredictionService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_SOLAR_API_URL || 'http://localhost:8000/api/dashboard';
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get solar power prediction from the AI model
   * @param request - Solar prediction parameters
   * @returns Promise<SolarPredictionResponse | SolarPredictionError>
   */
  async getSolarPrediction(request: SolarPredictionRequest): Promise<SolarPredictionResponse | SolarPredictionError> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { message: 'Authentication token not found. Please log in.', code: 'NO_TOKEN' };
      }

      const response = await fetch(`${this.apiUrl}/predict/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          message: errorData.error || `Solar prediction API error: ${response.status} ${response.statusText}`,
          code: 'API_ERROR'
        };
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Solar Prediction API Error:', error);
      return {
        message: 'Failed to get solar prediction. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Get model information
   * @returns Promise with model info or error
   */
  async getModelInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/info/`);
      
      if (!response.ok) {
        return {
          message: 'Failed to get model information',
          code: 'API_ERROR'
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Model Info API Error:', error);
      return {
        message: 'Failed to get model information',
        code: 'NETWORK_ERROR'
      };
    }
  }
}

// Export singleton instance
export const solarPredictionService = new SolarPredictionService();
