#!/usr/bin/env python3
"""
Test script to verify the API integration works correctly.
This script simulates the frontend sending data to the backend API.
"""

import requests
import json

def test_api_integration():
    """Test the complete API integration flow."""
    
    # API endpoint
    api_url = "http://localhost:8000/api/dashboard/predict/"
    
    # Test data (same format as frontend sends)
    test_data = {
        "panel_area": 50.0,
        "tilt": 30.0,
        "azimuth": 180.0,
        "ghi": 800.0,
        "dni": 640.0,
        "temperature": 25.0,
        "humidity": 65.0,
        "wind_speed": 3.5,
        "cloud_cover": "Fluffy white clouds"
    }
    
    print("Testing Solar Prediction API Integration")
    print("=" * 50)
    print(f"API URL: {api_url}")
    print(f"Test Data: {json.dumps(test_data, indent=2)}")
    print()
    
    try:
        # Send POST request to the API
        response = requests.post(
            api_url,
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Response Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API Request Successful!")
            print(f"Predicted Power: {result['predicted_power_generated']} kW")
            print(f"Model Type: {result['model_info']['model_type']}")
            print(f"Dataset Source: {result['model_info']['dataset_source']}")
            print()
            print("Full Response:")
            print(json.dumps(result, indent=2))
            return True
        else:
            print("❌ API Request Failed!")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Could not connect to the API server.")
        print("Make sure the Django server is running on localhost:8000")
        return False
    except requests.exceptions.Timeout:
        print("❌ Timeout Error: Request took too long.")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return False

def test_frontend_integration():
    """Test the frontend integration by simulating the complete flow."""
    
    print("\nTesting Frontend Integration Flow")
    print("=" * 50)
    
    # Simulate the data that would come from the frontend form
    frontend_form_data = {
        "location": "San Francisco, CA",
        "humidity": "65",
        "temperature": "25",
        "date": "2025-03-15",
        "time": "12:00",
        "solarIrradiance": "800",
        "windSpeed": "3.5",
        "cloudCover": "Fluffy white clouds",
        "panelArea": "50",
        "tilt": "30",
        "azimuth": "180"
    }
    
    print("Frontend Form Data:")
    print(json.dumps(frontend_form_data, indent=2))
    print()
    
    # Convert frontend data to API format
    api_data = {
        "panel_area": float(frontend_form_data["panelArea"]),
        "tilt": float(frontend_form_data["tilt"]),
        "azimuth": float(frontend_form_data["azimuth"]),
        "ghi": float(frontend_form_data["solarIrradiance"]),
        "dni": float(frontend_form_data["solarIrradiance"]) * 0.8,  # Estimate DNI as 80% of GHI
        "temperature": float(frontend_form_data["temperature"]),
        "humidity": float(frontend_form_data["humidity"]),
        "wind_speed": float(frontend_form_data["windSpeed"]),
        "cloud_cover": frontend_form_data["cloudCover"]
    }
    
    print("Converted API Data:")
    print(json.dumps(api_data, indent=2))
    print()
    
    # Test the API with converted data
    return test_api_with_data(api_data)

def test_api_with_data(api_data):
    """Test API with specific data."""
    
    api_url = "http://localhost:8000/api/dashboard/predict/"
    
    try:
        response = requests.post(
            api_url,
            json=api_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Frontend Integration Test Successful!")
            print(f"Predicted Power: {result['predicted_power_generated']} kW")
            print(f"Model Type: {result['model_info']['model_type']}")
            return True
        else:
            print(f"❌ Frontend Integration Test Failed! Status: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Frontend Integration Test Error: {e}")
        return False

if __name__ == "__main__":
    print("Solar Prediction API Integration Test")
    print("=" * 60)
    
    # Test basic API functionality
    api_success = test_api_integration()
    
    # Test frontend integration flow
    frontend_success = test_frontend_integration()
    
    print("\n" + "=" * 60)
    print("Test Results Summary:")
    print(f"API Test: {'✅ PASSED' if api_success else '❌ FAILED'}")
    print(f"Frontend Integration Test: {'✅ PASSED' if frontend_success else '❌ FAILED'}")
    
    if api_success and frontend_success:
        print("\n🎉 All tests passed! The integration is working correctly.")
        print("You can now use the frontend form to get predictions.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
