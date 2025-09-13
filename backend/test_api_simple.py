#!/usr/bin/env python3
"""
Simple test script for the Solar Power Prediction API
"""

import requests
import json

# Test data
test_data = {
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

def test_api():
    """Test the API endpoints"""
    
    print("🧪 Testing Solar Power Prediction API")
    print("=" * 50)
    
    # Test 1: Info endpoint
    print("\n1️⃣ Testing Info Endpoint...")
    try:
        response = requests.get("http://localhost:8000/api/dashboard/info/")
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            info = response.json()
            print(f"   ✅ Model Available: {info.get('model_available', False)}")
            print(f"   ✅ Model Type: {info.get('model_type', 'Unknown')}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Connection Error: {e}")
    
    # Test 2: Prediction endpoint
    print("\n2️⃣ Testing Prediction Endpoint...")
    try:
        response = requests.post(
            "http://localhost:8000/api/dashboard/predict/",
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Predicted Power: {result.get('predicted_power_generated', 'N/A')} kW")
            print(f"   ✅ Model Type: {result.get('model_info', {}).get('model_type', 'Unknown')}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Connection Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Test Complete!")

if __name__ == "__main__":
    test_api()
