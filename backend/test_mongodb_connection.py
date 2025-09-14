#!/usr/bin/env python3
"""
Test script to verify MongoDB Atlas connection and prediction storage.
"""

import os
import sys
import traceback
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_mongodb_connection():
    """Test MongoDB Atlas connection."""
    try:
        from authentication.mongodb import MongoDBConnection, get_predictions_collection
        from dashboard.models import PredictionModel
        
        print("Testing MongoDB Atlas Connection...")
        print("=" * 50)
        
        # Test basic connection
        try:
            client = MongoDBConnection.get_client()
            db = MongoDBConnection.get_database()
            print("✓ MongoDB client connected successfully")
            print(f"✓ Database: {db.name}")
        except Exception as e:
            print(f"✗ Failed to connect to MongoDB: {e}")
            return False
        
        # Test collections
        try:
            users_collection = MongoDBConnection.get_collection('users')
            predictions_collection = MongoDBConnection.get_collection('predictions')
            print("✓ Collections accessed successfully")
            print(f"✓ Users collection: {users_collection.name}")
            print(f"✓ Predictions collection: {predictions_collection.name}")
        except Exception as e:
            print(f"✗ Failed to access collections: {e}")
            return False
        
        # Test prediction model
        try:
            # Test data
            test_user_id = "test_user_123"
            test_input_data = {
                'location': 'Test City',
                'humidity': '65',
                'temperature': '25',
                'date': '2025-03-15',
                'time': '12:00',
                'solarIrradiance': '800',
                'windSpeed': '3.5',
                'cloudCover': 'Fluffy white clouds',
                'panelArea': '50',
                'tilt': '30',
                'azimuth': '180'
            }
            
            test_prediction_result = {
                'predicted_power_generated': 7.48,
                'input_parameters': {
                    'panel_area': 50.0,
                    'tilt': 30.0,
                    'azimuth': 180.0,
                    'ghi': 800.0,
                    'dni': 640.0,
                    'temperature': 25.0,
                    'humidity': 65.0,
                    'wind_speed': 3.5,
                    'cloud_cover': 'Fluffy white clouds'
                },
                'model_info': {
                    'model_type': 'FallbackCalculation',
                    'prediction_units': 'kW',
                    'dataset_source': 'Fallback Calculation'
                }
            }
            
            # Test creating a prediction
            prediction_id = PredictionModel.create_prediction(
                user_id=test_user_id,
                input_data=test_input_data,
                prediction_result=test_prediction_result
            )
            
            if prediction_id:
                print(f"✓ Prediction created successfully: {prediction_id}")
                
                # Test retrieving predictions
                predictions = PredictionModel.get_user_predictions(test_user_id, limit=5)
                print(f"✓ Retrieved {len(predictions)} predictions for user")
                
                # Test getting latest prediction
                latest = PredictionModel.get_user_latest_prediction(test_user_id)
                if latest:
                    print(f"✓ Latest prediction retrieved: {latest['prediction']['predicted_power_generated']} kW")
                
                # Test getting stats
                stats = PredictionModel.get_user_prediction_stats(test_user_id)
                print(f"✓ Stats retrieved: {stats['total_predictions']} total predictions")
                
                # Clean up test data
                PredictionModel.delete_prediction(prediction_id, test_user_id)
                print("✓ Test data cleaned up")
                
            else:
                print("✗ Failed to create prediction")
                return False
                
        except Exception as e:
            print(f"✗ Prediction model test failed: {e}")
            print(f"Error details: {traceback.format_exc()}")
            return False
        
        print("=" * 50)
        print("✅ All MongoDB tests passed! The connection is working correctly.")
        return True
        
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        print(f"Error details: {traceback.format_exc()}")
        return False

if __name__ == "__main__":
    print("MongoDB Atlas Connection Test")
    print("=" * 60)
    
    success = test_mongodb_connection()
    
    print("=" * 60)
    if success:
        print("🎉 All tests passed! MongoDB Atlas is ready to use.")
        print("You can now create predictions and they will be stored in your database.")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        print("Make sure your MongoDB Atlas connection string is correct and accessible.")
