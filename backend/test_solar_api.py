#!/usr/bin/env python3
"""
Test script for the Solar Power Prediction API
This script tests the API endpoints with sample data matching your Gujarat dataset.
"""

import requests
import json

# Base URL for your Django backend
BASE_URL = "http://localhost:8000"

# Sample test data matching your Gujarat dataset structure
test_data = {
    "panel_area": 50.0,      # Panel area in m²
    "tilt": 30.0,            # Panel tilt angle in degrees
    "azimuth": 180.0,        # Panel azimuth angle (180° = South)
    "ghi": 800.0,            # Global Horizontal Irradiance in W/m²
    "dni": 700.0,            # Direct Normal Irradiance in W/m²
    "temperature": 25.0,     # Temperature in Celsius
    "humidity": 60.0,        # Humidity percentage
    "wind_speed": 5.0,       # Wind speed in m/s
    "cloud_cover": "Fluffy white clouds"  # Cloud cover type
}

def test_api_endpoints():
    """Test both API endpoints"""
    
    print("🧪 Testing Solar Power Prediction API")
    print("=" * 50)
    
    # Test 1: Get model information
    print("\n1️⃣ Testing Info Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/dashboard/info/")
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            info = response.json()
            print(f"   ✅ Model Type: {info.get('model_type', 'Unknown')}")
            print(f"   ✅ Dataset Source: {info.get('dataset_source', 'Unknown')}")
            print(f"   ✅ Model Available: {info.get('model_available', False)}")
            print(f"   ✅ Required Parameters: {len(info.get('required_parameters', {}))}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Connection Error: {e}")
    
    # Test 2: Make a prediction
    print("\n2️⃣ Testing Prediction Endpoint...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/dashboard/predict/",
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Predicted Power Generated: {result.get('predicted_power_generated', 'N/A')} kW")
            print(f"   ✅ Model Type: {result.get('model_info', {}).get('model_type', 'Unknown')}")
            print(f"   ✅ Dataset Source: {result.get('model_info', {}).get('dataset_source', 'Unknown')}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Connection Error: {e}")
    
    # Test 3: Test with invalid cloud cover
    print("\n3️⃣ Testing Invalid Cloud Cover...")
    invalid_data = test_data.copy()
    invalid_data["cloud_cover"] = "Invalid cloud type"
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/dashboard/predict/",
            json=invalid_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 400:
            error = response.json()
            print(f"   ✅ Correctly rejected invalid input: {error.get('error', 'Unknown error')}")
        else:
            print(f"   ❌ Expected 400 error, got {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Connection Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Test Summary:")
    print("   - Make sure your Django server is running on port 8000")
    print("   - Ensure you have a valid JWT token for authentication")
    print("   - Check that your solar_power_model.pkl file is in the models/ directory")

if __name__ == "__main__":
    test_api_endpoints()
