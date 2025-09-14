#!/usr/bin/env python3
"""
Test script to verify the complete authentication and prediction flow.
"""

import requests
import json

def test_complete_flow():
    """Test the complete user authentication and prediction flow."""
    
    base_url = "http://localhost:8000/api"
    auth_url = f"{base_url}/auth"
    dashboard_url = f"{base_url}/dashboard"
    
    print("Testing Complete Solar Prediction Flow")
    print("=" * 60)
    
    # Test user registration
    print("1. Testing User Registration...")
    register_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "confirm_password": "testpassword123"
    }
    
    try:
        register_response = requests.post(f"{auth_url}/register/", json=register_data)
        print(f"   Registration Status: {register_response.status_code}")
        
        if register_response.status_code == 201:
            print("   ✅ User registered successfully")
            auth_data = register_response.json()
            access_token = auth_data['tokens']['access']
            user_id = auth_data['user']['id']
            print(f"   User ID: {user_id}")
        else:
            print(f"   ❌ Registration failed: {register_response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Registration error: {e}")
        return False
    
    # Test prediction creation
    print("\n2. Testing Prediction Creation...")
    prediction_data = {
        "panel_area": 50.0,
        "tilt": 30.0,
        "azimuth": 180.0,
        "ghi": 800.0,
        "dni": 640.0,
        "temperature": 25.0,
        "humidity": 65.0,
        "wind_speed": 3.5,
        "cloud_cover": "Fluffy white clouds",
        "location": "Ahmedabad",
        "date": "2025-03-15",
        "time": "12:00"
    }
    
    try:
        headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
        prediction_response = requests.post(f"{dashboard_url}/predict/", json=prediction_data, headers=headers)
        print(f"   Prediction Status: {prediction_response.status_code}")
        
        if prediction_response.status_code == 200:
            prediction_result = prediction_response.json()
            print("   ✅ Prediction created successfully")
            print(f"   Predicted Power: {prediction_result['predicted_power_generated']} kW")
            prediction_id = prediction_result.get('prediction_id')
            if prediction_id:
                print(f"   Prediction ID: {prediction_id}")
        else:
            print(f"   ❌ Prediction failed: {prediction_response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Prediction error: {e}")
        return False
    
    # Test getting user predictions
    print("\n3. Testing User Predictions Retrieval...")
    try:
        predictions_response = requests.get(f"{dashboard_url}/user-predictions/", headers=headers)
        print(f"   Predictions Status: {predictions_response.status_code}")
        
        if predictions_response.status_code == 200:
            predictions_data = predictions_response.json()
            print("   ✅ User predictions retrieved successfully")
            print(f"   Number of predictions: {predictions_data['count']}")
        else:
            print(f"   ❌ Predictions retrieval failed: {predictions_response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Predictions retrieval error: {e}")
        return False
    
    # Test getting latest prediction
    print("\n4. Testing Latest Prediction Retrieval...")
    try:
        latest_response = requests.get(f"{dashboard_url}/user-latest-prediction/", headers=headers)
        print(f"   Latest Prediction Status: {latest_response.status_code}")
        
        if latest_response.status_code == 200:
            latest_data = latest_response.json()
            print("   ✅ Latest prediction retrieved successfully")
            print(f"   Latest Power: {latest_data['prediction']['predicted_power_generated']} kW")
        else:
            print(f"   ❌ Latest prediction retrieval failed: {latest_response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Latest prediction error: {e}")
        return False
    
    # Test getting user stats
    print("\n5. Testing User Statistics...")
    try:
        stats_response = requests.get(f"{dashboard_url}/user-stats/", headers=headers)
        print(f"   Stats Status: {stats_response.status_code}")
        
        if stats_response.status_code == 200:
            stats_data = stats_response.json()
            print("   ✅ User statistics retrieved successfully")
            print(f"   Total Predictions: {stats_data['stats']['total_predictions']}")
        else:
            print(f"   ❌ Stats retrieval failed: {stats_response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Stats error: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("🎉 All tests passed! The complete flow is working correctly.")
    print("✅ User registration and authentication")
    print("✅ Prediction creation and MongoDB storage")
    print("✅ User-specific data retrieval")
    print("✅ MongoDB Atlas integration")
    return True

if __name__ == "__main__":
    success = test_complete_flow()
    
    if not success:
        print("\n❌ Some tests failed. Please check the errors above.")
        print("Make sure both the backend server and MongoDB Atlas are running.")
