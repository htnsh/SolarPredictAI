from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
import joblib
import pandas as pd
import numpy as np
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Load the model once when the module is imported
MODEL_PATH = os.path.join(settings.BASE_DIR, 'models', 'solar_power_model.pkl')
try:
    SOLAR_MODEL = joblib.load(MODEL_PATH)
    logger.info(f"Solar power model loaded successfully: {type(SOLAR_MODEL)}")
except Exception as e:
    logger.error(f"Failed to load solar power model: {e}")
    SOLAR_MODEL = None

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated access for testing
def predict_solar_power(request):
    """
    API endpoint to predict solar power generation based on input parameters.
    
    Expected input parameters (matching the Gujarat solar dataset):
    - panel_area: Panel area in m²
    - tilt: Panel tilt angle in degrees
    - azimuth: Panel azimuth angle in degrees
    - ghi: Global Horizontal Irradiance in W/m² (Solar Irradiance)
    - dni: Direct Normal Irradiance in W/m²
    - temperature: Temperature in Celsius
    - humidity: Humidity percentage
    - wind_speed: Wind speed in m/s
    - cloud_cover: Cloud cover type (categorical string)
    """
    
    if SOLAR_MODEL is None:
        return Response(
            {'error': 'Solar power model is not available'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    try:
        # Extract input parameters from request
        data = request.data
        
        # Required parameters (matching the dataset columns)
        required_params = [
            'panel_area', 'tilt', 'azimuth', 'ghi', 
            'dni', 'temperature', 'humidity', 'wind_speed', 'cloud_cover'
        ]
        
        # Check if all required parameters are provided
        missing_params = [param for param in required_params if param not in data]
        if missing_params:
            return Response(
                {'error': f'Missing required parameters: {missing_params}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract and validate parameters
        panel_area = float(data['panel_area'])
        tilt = float(data['tilt'])
        azimuth = float(data['azimuth'])
        ghi = float(data['ghi'])  # Global Horizontal Irradiance
        dni = float(data['dni'])
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        wind_speed = float(data['wind_speed'])
        cloud_cover = str(data['cloud_cover'])
        
        # Validate cloud cover type
        valid_cloud_types = [
            'Fluffy white clouds', 'Mid-level clouds', 
            'Thin high clouds', 'Thick low clouds'
        ]
        
        if cloud_cover not in valid_cloud_types:
            return Response(
                {'error': f'Invalid cloud cover type. Must be one of: {valid_cloud_types}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate ranges
        if not (0 <= humidity <= 100):
            return Response(
                {'error': 'Humidity must be between 0 and 100'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create feature vector matching the training data format
        # The model expects a DataFrame with the same column names as training data
        # Based on your training code, the model uses a preprocessing pipeline
        
        # Create a DataFrame with ALL required features (matching training data)
        # The model expects ALL columns except 'Power Generated (kW)'
        input_data = pd.DataFrame({
            'City': [data.get('city', 0)],  # Default city index
            'Date': [data.get('date', '2025-03-15')],  # Default date
            'Time': [data.get('time', '12:00')],  # Default time
            'Panel area (m^2)': [panel_area],
            'Tilt (deg)': [tilt],
            'Azimuth (deg)': [azimuth],
            'Solar Irradiance (W/m^2)': [ghi],  # GHI is Solar Irradiance
            'DNI (W/m^2)': [dni],
            'Temperature (C)': [temperature],
            'Humidity (%)': [humidity],
            'Wind Speed (m/s)': [wind_speed],
            'Power Consumed (kW)': [data.get('power_consumed', 0.0)],  # Default power consumed
            'Cloud Cover': [cloud_cover]  # This will be treated as categorical
        })
        
        # Make prediction using the trained pipeline (includes preprocessing)
        prediction = SOLAR_MODEL.predict(input_data)[0]
        
        # Prepare response
        response_data = {
            'predicted_power_generated': float(prediction),
            'input_parameters': {
                'panel_area': panel_area,
                'tilt': tilt,
                'azimuth': azimuth,
                'ghi': ghi,
                'dni': dni,
                'temperature': temperature,
                'humidity': humidity,
                'wind_speed': wind_speed,
                'cloud_cover': cloud_cover
            },
            'model_info': {
                'model_type': str(type(SOLAR_MODEL).__name__),
                'prediction_units': 'kW',
                'dataset_source': 'Gujarat Solar Dataset'
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except ValueError as e:
        return Response(
            {'error': f'Invalid parameter value: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Error in solar power prediction: {e}")
        return Response(
            {'error': 'An error occurred while making the prediction'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow unauthenticated access for testing
def get_prediction_info(request):
    """
    Get information about the solar power prediction model and required parameters.
    """
    
    if SOLAR_MODEL is None:
        return Response(
            {'error': 'Solar power model is not available'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    info = {
        'model_type': str(type(SOLAR_MODEL).__name__),
        'model_available': True,
        'dataset_source': 'Gujarat Solar Dataset',
        'required_parameters': {
            'panel_area': {
                'type': 'float',
                'description': 'Panel area in square meters',
                'unit': 'm²',
                'range': '> 0'
            },
            'tilt': {
                'type': 'float', 
                'description': 'Panel tilt angle',
                'unit': 'degrees',
                'range': '0-90'
            },
            'azimuth': {
                'type': 'float',
                'description': 'Panel azimuth angle (0° = North, 90° = East, 180° = South, 270° = West)', 
                'unit': 'degrees',
                'range': '0-360'
            },
            'ghi': {
                'type': 'float',
                'description': 'Global Horizontal Irradiance (Solar Irradiance)',
                'unit': 'W/m²',
                'range': '≥ 0'
            },
            'dni': {
                'type': 'float',
                'description': 'Direct Normal Irradiance',
                'unit': 'W/m²',
                'range': '≥ 0'
            },
            'temperature': {
                'type': 'float',
                'description': 'Ambient temperature',
                'unit': 'Celsius',
                'range': 'Any'
            },
            'humidity': {
                'type': 'float',
                'description': 'Relative humidity',
                'unit': 'percentage',
                'range': '0-100'
            },
            'wind_speed': {
                'type': 'float',
                'description': 'Wind speed',
                'unit': 'm/s',
                'range': '≥ 0'
            },
            'cloud_cover': {
                'type': 'string',
                'description': 'Cloud cover type',
                'valid_values': [
                    'Fluffy white clouds', 'Mid-level clouds', 
                    'Thin high clouds', 'Thick low clouds'
                ]
            }
        },
        'output': {
            'predicted_power_generated': {
                'type': 'float',
                'description': 'Predicted solar power generation',
                'unit': 'kW'
            }
        }
    }
    
    return Response(info, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated access for testing
def test_predict_solar_power(request):
    """
    Test endpoint for solar power prediction without authentication.
    Use this for testing purposes only.
    """
    
    if SOLAR_MODEL is None:
        return Response(
            {'error': 'Solar power model is not available'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    try:
        # Extract input parameters from request
        data = request.data
        
        # Required parameters (matching the dataset columns)
        required_params = [
            'panel_area', 'tilt', 'azimuth', 'ghi', 
            'dni', 'temperature', 'humidity', 'wind_speed', 'cloud_cover'
        ]
        
        # Check if all required parameters are provided
        missing_params = [param for param in required_params if param not in data]
        if missing_params:
            return Response(
                {'error': f'Missing required parameters: {missing_params}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract and validate parameters
        panel_area = float(data['panel_area'])
        tilt = float(data['tilt'])
        azimuth = float(data['azimuth'])
        ghi = float(data['ghi'])  # Global Horizontal Irradiance
        dni = float(data['dni'])
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        wind_speed = float(data['wind_speed'])
        cloud_cover = str(data['cloud_cover'])
        
        # Validate cloud cover type
        valid_cloud_types = [
            'Fluffy white clouds', 'Mid-level clouds', 
            'Thin high clouds', 'Thick low clouds'
        ]
        
        if cloud_cover not in valid_cloud_types:
            return Response(
                {'error': f'Invalid cloud cover type. Must be one of: {valid_cloud_types}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate ranges
        if not (0 <= humidity <= 100):
            return Response(
                {'error': 'Humidity must be between 0 and 100'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create a DataFrame with the input features
        input_data = pd.DataFrame({
            'Panel area (m^2)': [panel_area],
            'Tilt (deg)': [tilt],
            'Azimuth (deg)': [azimuth],
            'Solar Irradiance (W/m^2)': [ghi],  # GHI is Solar Irradiance
            'DNI (W/m^2)': [dni],
            'Temperature (C)': [temperature],
            'Humidity (%)': [humidity],
            'Wind Speed (m/s)': [wind_speed],
            'Cloud Cover': [cloud_cover]  # This will be treated as categorical
        })
        
        # Make prediction using the trained pipeline (includes preprocessing)
        prediction = SOLAR_MODEL.predict(input_data)[0]
        
        # Prepare response
        response_data = {
            'predicted_power_generated': float(prediction),
            'input_parameters': {
                'panel_area': panel_area,
                'tilt': tilt,
                'azimuth': azimuth,
                'ghi': ghi,
                'dni': dni,
                'temperature': temperature,
                'humidity': humidity,
                'wind_speed': wind_speed,
                'cloud_cover': cloud_cover
            },
            'model_info': {
                'model_type': str(type(SOLAR_MODEL).__name__),
                'prediction_units': 'kW',
                'dataset_source': 'Gujarat Solar Dataset'
            },
            'note': 'This is a test endpoint - no authentication required'
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except ValueError as e:
        return Response(
            {'error': f'Invalid parameter value: {str(e)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Error in solar power prediction: {e}")
        return Response(
            {'error': 'An error occurred while making the prediction'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
