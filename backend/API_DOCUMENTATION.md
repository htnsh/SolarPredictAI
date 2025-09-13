# Solar Power Prediction API Documentation

## Overview
This API provides endpoints for predicting solar power generation based on various environmental and panel configuration parameters.

## Base URL
```
http://localhost:8000/api/dashboard/
```

## Authentication
All endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get Prediction Information
**GET** `/info/`

Returns information about the solar power prediction model and required parameters.

#### Response
```json
{
  "model_type": "RandomForestRegressor",
  "model_available": true,
  "required_parameters": {
    "panel_area": {
      "type": "float",
      "description": "Panel area in square meters",
      "unit": "m²"
    },
    "tilt": {
      "type": "float",
      "description": "Panel tilt angle",
      "unit": "degrees"
    },
    "azimuth": {
      "type": "float",
      "description": "Panel azimuth angle",
      "unit": "degrees"
    },
    "solar_irradiance": {
      "type": "float",
      "description": "Solar irradiance",
      "unit": "W/m²"
    },
    "dni": {
      "type": "float",
      "description": "Direct Normal Irradiance",
      "unit": "W/m²"
    },
    "temperature": {
      "type": "float",
      "description": "Ambient temperature",
      "unit": "Celsius"
    },
    "humidity": {
      "type": "float",
      "description": "Relative humidity",
      "unit": "percentage"
    },
    "wind_speed": {
      "type": "float",
      "description": "Wind speed",
      "unit": "m/s"
    },
    "cloud_cover": {
      "type": "string",
      "description": "Cloud cover type",
      "valid_values": [
        "Clear sky", "Thin high clouds", "Mid-level clouds",
        "Fluffy white clouds", "Thick clouds", "Overcast"
      ]
    }
  },
  "output": {
    "predicted_power_generated": {
      "type": "float",
      "description": "Predicted solar power generation",
      "unit": "kW"
    }
  }
}
```

### 2. Predict Solar Power
**POST** `/predict/`

Predicts solar power generation based on input parameters.

#### Request Body
```json
{
  "panel_area": 50.0,
  "tilt": 30.0,
  "azimuth": 180.0,
  "ghi": 800.0,
  "dni": 700.0,
  "temperature": 25.0,
  "humidity": 60.0,
  "wind_speed": 5.0,
  "cloud_cover": "Fluffy white clouds"
}
```

#### Response (Success)
```json
{
  "predicted_power_generated": 12.5,
  "input_parameters": {
    "panel_area": 50.0,
    "tilt": 30.0,
    "azimuth": 180.0,
    "ghi": 800.0,
    "dni": 700.0,
    "temperature": 25.0,
    "humidity": 60.0,
    "wind_speed": 5.0,
    "cloud_cover": "Fluffy white clouds"
  },
  "model_info": {
    "model_type": "RandomForestRegressor",
    "prediction_units": "kW",
    "dataset_source": "Gujarat Solar Dataset"
  }
}
```

#### Error Responses

**400 Bad Request** - Missing or invalid parameters
```json
{
  "error": "Missing required parameters: ['panel_area', 'tilt']"
}
```

**400 Bad Request** - Invalid cloud cover type
```json
{
  "error": "Invalid cloud cover type. Must be one of: ['Fluffy white clouds', 'Mid-level clouds', 'Thin high clouds', 'Thick low clouds']"
}
```

**500 Internal Server Error** - Model not available
```json
{
  "error": "Solar power model is not available"
}
```

## Example Usage

### Using curl
```bash
# Get prediction info
curl -H "Authorization: Bearer <your_token>" \
     -H "Content-Type: application/json" \
     http://localhost:8000/api/dashboard/info/

# Make a prediction
curl -X POST \
     -H "Authorization: Bearer <your_token>" \
     -H "Content-Type: application/json" \
     -d '{
       "panel_area": 50.0,
       "tilt": 30.0,
       "azimuth": 180.0,
       "ghi": 800.0,
       "dni": 700.0,
       "temperature": 25.0,
       "humidity": 60.0,
       "wind_speed": 5.0,
       "cloud_cover": "Fluffy white clouds"
     }' \
     http://localhost:8000/api/dashboard/predict/
```

### Using Python requests
```python
import requests

# Set up authentication
headers = {
    'Authorization': 'Bearer <your_jwt_token>',
    'Content-Type': 'application/json'
}

# Make prediction
data = {
    "panel_area": 50.0,
    "tilt": 30.0,
    "azimuth": 180.0,
    "ghi": 800.0,
    "dni": 700.0,
    "temperature": 25.0,
    "humidity": 60.0,
    "wind_speed": 5.0,
    "cloud_cover": "Fluffy white clouds"
}

response = requests.post(
    'http://localhost:8000/api/dashboard/predict/',
    json=data,
    headers=headers
)

if response.status_code == 200:
    result = response.json()
    print(f"Predicted power generation: {result['predicted_power_generated']} kW")
else:
    print(f"Error: {response.json()['error']}")
```

## Notes

1. **Model Loading**: The solar power model is loaded when the Django application starts. If the model file is not found or corrupted, the endpoints will return a 500 error.

2. **Feature Scaling**: The current implementation assumes the model expects raw feature values. If your trained model uses scaled/normalized features, you may need to apply the same scaling in the prediction endpoint.

3. **Cloud Cover**: The cloud cover parameter must be one of the predefined categorical values: 'Fluffy white clouds', 'Mid-level clouds', 'Thin high clouds', or 'Thick low clouds'.

4. **Units**: All input parameters must be provided in the specified units (meters, degrees, W/m², Celsius, percentage, m/s).

5. **Authentication**: Make sure to obtain a valid JWT token from the authentication endpoints before calling the prediction API.
