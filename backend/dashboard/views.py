from django.http import JsonResponse

# Simple test endpoint to debug URL registration
def test_view(request):
    print('DEBUG: test_view endpoint called')
    return JsonResponse({'status': 'ok', 'message': 'Test endpoint is working.'})
import io
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.http import FileResponse, HttpResponse
from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
# Export report endpoint
from .models import PredictionModel
## DEBUG: Commented out DRF decorators for troubleshooting
# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
def export_report(request):
    print('DEBUG: export_report endpoint called')
    user_id = str(request.user.id) if hasattr(request.user, 'id') else None
    export_format = request.GET.get('format', 'csv')
    period = request.GET.get('period', 'daily')
    if not user_id:
        return HttpResponse('Unauthorized', status=401)
    # Get all predictions for user
    predictions = PredictionModel.get_user_predictions(user_id, limit=1000, skip=0)
    # Flatten for DataFrame
    rows = []
    for p in predictions:
        created = p.get('created_at')
        pred = p.get('prediction', {})
        val = pred.get('predicted_power_generated', 0)
        rows.append({'created_at': created, 'predicted_power_generated': val})
    df = pd.DataFrame(rows)
    # Aggregate by period
    if not df.empty:
        if period == 'daily':
            df['date'] = pd.to_datetime(df['created_at']).dt.date
            grouped = df.groupby('date').agg({'predicted_power_generated': 'sum'}).reset_index()
        elif period == 'weekly':
            df['week'] = pd.to_datetime(df['created_at']).dt.to_period('W').apply(lambda r: r.start_time.date())
            grouped = df.groupby('week').agg({'predicted_power_generated': 'sum'}).reset_index()
        elif period == 'monthly':
            df['month'] = pd.to_datetime(df['created_at']).dt.to_period('M').astype(str)
            grouped = df.groupby('month').agg({'predicted_power_generated': 'sum'}).reset_index()
        else:
            grouped = df
    else:
        grouped = pd.DataFrame()
    # Get recommendations
    recs_resp = get_recommendations(request)
    recommendations = []
    if hasattr(recs_resp, 'data') and isinstance(recs_resp.data, dict):
        recommendations = recs_resp.data.get('recommendations', [])
    if export_format == 'csv':
        output = io.StringIO()
        if not grouped.empty:
            grouped.to_csv(output, index=False)
        output.write('\n\nRecommendations:\n')
        for rec in recommendations:
            output.write(f"- {rec['title']}: {rec['description']}\n")
        response = HttpResponse(output.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename=solar_report_{period}_{datetime.now().date()}.csv'
        return response
    elif export_format == 'pdf':
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.setFont('Helvetica', 12)
        p.drawString(30, 750, f'Solar Prediction Report ({period.title()})')
        y = 720
        if not grouped.empty:
            for idx, row in grouped.iterrows():
                p.drawString(30, y, f"{row[0]}: {row[1]:.2f} kWh")
                y -= 20
        y -= 20
        p.drawString(30, y, 'Recommendations:')
        y -= 20
        for rec in recommendations:
            p.drawString(40, y, f"- {rec['title']}: {rec['description']}")
            y -= 20
            if y < 50:
                p.showPage()
                y = 750
        p.save()
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename=f'solar_report_{period}_{datetime.now().date()}.pdf')
    else:
        return HttpResponse('Invalid format', status=400)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from authentication.mongodb import get_predictions_collection

# Dynamic recommendations endpoint
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    user_id = str(request.user.id) if hasattr(request.user, 'id') else None
    recommendations = []
    if not user_id:
        return Response({"recommendations": []}, status=status.HTTP_200_OK)

    # Fetch latest prediction for this user
    predictions_col = get_predictions_collection()
    latest = predictions_col.find_one({"user_id": user_id}, sort=[("created_at", -1)])

    if latest and "prediction" in latest and "input_parameters" in latest["prediction"]:
        params = latest["prediction"]["input_parameters"]
        predicted_power = latest["prediction"].get("predicted_power_generated")
        # 1. Low Power Recommendation
        if predicted_power is not None and predicted_power < 2.0:
            recommendations.append({
                "title": "Increase Panel Area",
                "current": f"{params.get('panel_area', '-')}",
                "recommended": "Consider adding more panels",
                "improvement": "+20% potential output",
                "description": "Your predicted power is low. Increasing the panel area can significantly boost your energy generation.",
                "priority": "high",
            })
        # 2. High Temperature Warning
        if params.get("temperature") is not None and params["temperature"] > 45:
            recommendations.append({
                "title": "High Temperature Detected",
                "current": f"{params['temperature']}°C",
                "recommended": "Improve ventilation or shading",
                "improvement": "+5% efficiency",
                "description": "High temperatures can reduce panel efficiency. Consider improving airflow or partial shading during peak heat.",
                "priority": "medium",
            })
        # 3. High Humidity Warning
        if params.get("humidity") is not None and params["humidity"] > 80:
            recommendations.append({
                "title": "High Humidity Detected",
                "current": f"{params['humidity']}%",
                "recommended": "Regular panel cleaning",
                "improvement": "+3% efficiency",
                "description": "High humidity can cause dust and grime to stick to panels. Clean panels more frequently for optimal performance.",
                "priority": "medium",
            })
        # 4. Optimal Tilt Angle
        current_tilt = params.get("tilt")
        optimal_tilt = 32
        if current_tilt is not None and abs(current_tilt - optimal_tilt) > 2:
            recommendations.append({
                "title": "Optimal Tilt Angle",
                "current": f"{current_tilt}°",
                "recommended": f"{optimal_tilt}°",
                "improvement": "+14% efficiency",
                "description": f"Adjusting your panel tilt to {optimal_tilt}° will maximize solar exposure throughout the year.",
                "priority": "high",
            })
        # 5. Azimuth Orientation
        current_azimuth = params.get("azimuth")
        optimal_azimuth = 180
        if current_azimuth is not None and abs(current_azimuth - optimal_azimuth) > 5:
            recommendations.append({
                "title": "Azimuth Orientation",
                "current": f"{current_azimuth}°",
                "recommended": f"{optimal_azimuth}°",
                "improvement": "+8% efficiency",
                "description": "Rotating panels more towards true south will increase energy capture.",
                "priority": "medium",
            })
        # 6. Seasonal Adjustment
        if params.get("tilt") == params.get("azimuth"):
            recommendations.append({
                "title": "Seasonal Adjustment",
                "current": "Fixed",
                "recommended": "Bi-annual",
                "improvement": "+12% efficiency",
                "description": "Adjusting tilt twice yearly (winter: +15°, summer: -15°) optimizes performance.",
                "priority": "medium",
            })

    # If no recommendations, provide a more meaningful message or fallback
    if not recommendations:
        if latest:
            recommendations.append({
                "title": "Great Job!",
                "current": "All key parameters optimal",
                "recommended": "Maintain current setup",
                "improvement": "Max efficiency achieved",
                "description": "Your solar system is configured for maximum efficiency based on your latest prediction. Keep monitoring for seasonal or environmental changes.",
                "priority": "low",
            })
        else:
            recommendations.append({
                "title": "No Prediction Data",
                "current": "-",
                "recommended": "Submit a prediction",
                "improvement": "-",
                "description": "No prediction data found. Please generate a prediction to receive personalized recommendations.",
                "priority": "medium",
            })

    return Response({"recommendations": recommendations}, status=status.HTTP_200_OK)
from datetime import datetime, timedelta
from authentication.mongodb import get_historical_collection
# New API endpoint: Get today's power generation data for the authenticated user
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def get_todays_power_generation(request):
    """
    Get all power generation records for today for the authenticated user.
    Returns a list of {time, power_generated, city, ...} for graphing.
    """
    try:
        collection = get_historical_collection()
        city = request.GET.get('city')
        # Find the latest two dates for this city (no user filter, flat doc structure)
        match = {}
        if city:
            match['City'] = city
        # Get all unique dates for the city, sorted descending
        dates_cursor = collection.find({'City': city} if city else {}).sort('Date', -1)
        latest_dates = []
        for doc in dates_cursor:
            date_val = doc.get('Date')
            if date_val and date_val not in latest_dates:
                latest_dates.append(date_val)
            if len(latest_dates) == 2:
                break
        if not latest_dates:
            return Response({'data': []}, status=status.HTTP_200_OK)
        # Now get all records for those dates and city
        query = {'Date': {'$in': latest_dates}}
        if city:
            query['City'] = city
        cursor = collection.find(query).sort([('Date', 1), ('Time', 1)])
        results = []
        for doc in cursor:
            time = doc.get('Time', None)
            power = doc.get('Power Generated (kW)', None)
            city_val = doc.get('City', None)
            date_val = doc.get('Date', None)
            results.append({
                'date': date_val,
                'time': time,
                'power_generated': power,
                'city': city_val,
                '_id': str(doc.get('_id'))
            })
        return Response({'data': results}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Error fetching today's power generation: {e}")
        return Response({'error': 'Failed to fetch today\'s power generation'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import numpy as np
import os
from django.conf import settings
import logging
from .models import PredictionModel
from authentication.jwt_auth import CustomJWTAuthentication

logger = logging.getLogger(__name__)

# Try to import joblib, if not available, we'll handle it gracefully
try:
    import joblib
    JOBLIB_AVAILABLE = True
except ImportError:
    JOBLIB_AVAILABLE = False
    logger.warning("joblib not available. Model loading will be disabled.")

# Load the model once when the module is imported
MODEL_PATH = os.path.join(settings.BASE_DIR, 'models', 'solar_power_model.pkl')
SOLAR_MODEL = None

if JOBLIB_AVAILABLE:
    try:
        SOLAR_MODEL = joblib.load(MODEL_PATH)
        logger.info(f"Solar power model loaded successfully: {type(SOLAR_MODEL)}")
    except Exception as e:
        logger.error(f"Failed to load solar power model: {e}")
        SOLAR_MODEL = None
else:
    logger.error("joblib not available. Cannot load model.")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
        
        # Make prediction
        if SOLAR_MODEL is not None:
            # Use the trained model
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
            prediction = SOLAR_MODEL.predict(input_data)[0]
            model_type = str(type(SOLAR_MODEL).__name__)
        else:
            # Fallback calculation when model is not available
            # Simple formula based on solar irradiance and panel area
            base_power = (ghi / 1000) * panel_area * 0.2  # 20% efficiency
            temperature_factor = 1 - (temperature - 25) * 0.004  # Temperature coefficient
            cloud_factor = 1 - (humidity / 100) * 0.1  # Humidity effect
            prediction = base_power * temperature_factor * cloud_factor
            model_type = "FallbackCalculation"
        
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
                'model_type': model_type,
                'prediction_units': 'kW',
                'dataset_source': 'Gujarat Solar Dataset' if SOLAR_MODEL else 'Fallback Calculation'
            }
        }
        
        # Save prediction to MongoDB
        try:
            user_id = str(request.user.id)  # Get user ID from authenticated request
            
            # Prepare input data for storage (include all form fields)
            input_data_for_storage = {
                'location': data.get('location', ''),
                'humidity': str(humidity),
                'temperature': str(temperature),
                'date': data.get('date', ''),
                'time': data.get('time', ''),
                'solarIrradiance': str(ghi),
                'windSpeed': str(wind_speed),
                'cloudCover': cloud_cover,
                'panelArea': str(panel_area),
                'tilt': str(tilt),
                'azimuth': str(azimuth)
            }
            
            # Save to MongoDB
            prediction_id = PredictionModel.create_prediction(
                user_id=user_id,
                input_data=input_data_for_storage,
                prediction_result=response_data
            )
            
            if prediction_id:
                response_data['prediction_id'] = prediction_id
                logger.info(f"Prediction saved to MongoDB for user {user_id}: {prediction_id}")
            else:
                logger.warning(f"Failed to save prediction to MongoDB for user {user_id}")
                
        except Exception as e:
            logger.error(f"Error saving prediction to MongoDB: {e}")
            # Don't fail the request if MongoDB save fails, just log the error
        
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
    
    info = {
        'model_type': str(type(SOLAR_MODEL).__name__) if SOLAR_MODEL else "FallbackCalculation",
        'model_available': SOLAR_MODEL is not None,
        'dataset_source': 'Gujarat Solar Dataset' if SOLAR_MODEL else 'Fallback Calculation',
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_predictions(request):
    """
    Get all predictions for the authenticated user
    """
    try:
        user_id = str(request.user.id)
        limit = int(request.GET.get('limit', 10))
        skip = int(request.GET.get('skip', 0))
        
        predictions = PredictionModel.get_user_predictions(user_id, limit=limit, skip=skip)
        
        return Response({
            'predictions': predictions,
            'count': len(predictions),
            'user_id': user_id
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error getting predictions for user {request.user.id}: {e}")
        return Response(
            {'error': 'Failed to retrieve predictions'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_latest_prediction(request):
    """
    Get the latest prediction for the authenticated user
    """
    try:
        user_id = str(request.user.id)
        prediction = PredictionModel.get_user_latest_prediction(user_id)
        
        if prediction:
            return Response(prediction, status=status.HTTP_200_OK)
        else:
            return Response(
                {'message': 'No predictions found for this user'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
    except Exception as e:
        logger.error(f"Error getting latest prediction for user {request.user.id}: {e}")
        return Response(
            {'error': 'Failed to retrieve latest prediction'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_prediction_stats(request):
    """
    Get prediction statistics for the authenticated user
    """
    try:
        user_id = str(request.user.id)
        stats = PredictionModel.get_user_prediction_stats(user_id)
        
        return Response({
            'user_id': user_id,
            'stats': stats
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Error getting prediction stats for user {request.user.id}: {e}")
        return Response(
            {'error': 'Failed to retrieve prediction statistics'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_prediction(request, prediction_id):
    """
    Delete a specific prediction (only if it belongs to the authenticated user)
    """
    try:
        user_id = str(request.user.id)
        success = PredictionModel.delete_prediction(prediction_id, user_id)
        
        if success:
            return Response(
                {'message': 'Prediction deleted successfully'}, 
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Prediction not found or not owned by user'}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
    except Exception as e:
        logger.error(f"Error deleting prediction {prediction_id} for user {request.user.id}: {e}")
        return Response(
            {'error': 'Failed to delete prediction'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
