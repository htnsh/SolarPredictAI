// User Prediction API service for fetching user-specific predictions
export interface UserPrediction {
  _id: string;
  user_id: string;
  input_data: {
    location: string;
    humidity: string;
    temperature: string;
    date: string;
    time: string;
    solarIrradiance: string;
    windSpeed: string;
    cloudCover: string;
    panelArea: string;
    tilt: string;
    azimuth: string;
  };
  prediction: {
    predicted_power_generated: number;
    input_parameters: {
      panel_area: number;
      tilt: number;
      azimuth: number;
      ghi: number;
      dni: number;
      temperature: number;
      humidity: number;
      wind_speed: number;
      cloud_cover: string;
    };
    model_info: {
      model_type: string;
      prediction_units: string;
      dataset_source: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface UserPredictionStats {
  total_predictions: number;
  latest_prediction_date: string | null;
  average_power: number;
  max_power: number;
  min_power: number;
}

export interface UserPredictionError {
  message: string;
  code?: string;
}

class UserPredictionService {
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
   * Get all predictions for the authenticated user
   * @param limit - Maximum number of predictions to return
   * @param skip - Number of predictions to skip (for pagination)
   * @returns Promise<UserPrediction[] | UserPredictionError>
   */
  async getUserPredictions(limit: number = 10, skip: number = 0): Promise<UserPrediction[] | UserPredictionError> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { message: 'Authentication token not found', code: 'NO_TOKEN' };
      }

      const response = await fetch(`${this.apiUrl}/user-predictions/?limit=${limit}&skip=${skip}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          message: errorData.error || `User predictions API error: ${response.status} ${response.statusText}`,
          code: 'API_ERROR'
        };
      }

      const data = await response.json();
      return data.predictions;

    } catch (error) {
      console.error('User Predictions API Error:', error);
      return {
        message: 'Failed to get user predictions. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Get the latest prediction for the authenticated user
   * @returns Promise<UserPrediction | UserPredictionError>
   */
  async getLatestPrediction(): Promise<UserPrediction | UserPredictionError> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { message: 'Authentication token not found', code: 'NO_TOKEN' };
      }

      const response = await fetch(`${this.apiUrl}/user-latest-prediction/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { message: 'No predictions found for this user', code: 'NOT_FOUND' };
        }
        const errorData = await response.json().catch(() => ({}));
        return {
          message: errorData.error || `Latest prediction API error: ${response.status} ${response.statusText}`,
          code: 'API_ERROR'
        };
      }

      return await response.json();

    } catch (error) {
      console.error('Latest Prediction API Error:', error);
      return {
        message: 'Failed to get latest prediction. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Get prediction statistics for the authenticated user
   * @returns Promise<UserPredictionStats | UserPredictionError>
   */
  async getPredictionStats(): Promise<UserPredictionStats | UserPredictionError> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { message: 'Authentication token not found', code: 'NO_TOKEN' };
      }

      const response = await fetch(`${this.apiUrl}/user-stats/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          message: errorData.error || `Prediction stats API error: ${response.status} ${response.statusText}`,
          code: 'API_ERROR'
        };
      }

      const data = await response.json();
      return data.stats;

    } catch (error) {
      console.error('Prediction Stats API Error:', error);
      return {
        message: 'Failed to get prediction statistics. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Delete a specific prediction
   * @param predictionId - ID of the prediction to delete
   * @returns Promise<boolean | UserPredictionError>
   */
  async deletePrediction(predictionId: string): Promise<boolean | UserPredictionError> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { message: 'Authentication token not found', code: 'NO_TOKEN' };
      }

      const response = await fetch(`${this.apiUrl}/delete-prediction/${predictionId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          message: errorData.error || `Delete prediction API error: ${response.status} ${response.statusText}`,
          code: 'API_ERROR'
        };
      }

      return true;

    } catch (error) {
      console.error('Delete Prediction API Error:', error);
      return {
        message: 'Failed to delete prediction. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Get today's power generation data for the authenticated user, optionally filtered by city
   * @param city - City/location to filter by
   * @returns Promise<{ time: string, power_generated: number, city: string }[] | UserPredictionError>
   */
  async getTodaysPowerGeneration(city?: string): Promise<Array<{ time: string, power_generated: number, city: string }> | UserPredictionError> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        return { message: 'Authentication token not found', code: 'NO_TOKEN' };
      }
      let url = `${this.apiUrl}/todays-power/`;
      if (city) {
        url += `?city=${encodeURIComponent(city)}`;
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          message: errorData.error || `Today's power API error: ${response.status} ${response.statusText}`,
          code: 'API_ERROR'
        };
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Today's Power API Error:", error);
      return {
        message: 'Failed to get today\'s power generation. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  }
}

// Export singleton instance
export const userPredictionService = new UserPredictionService();
