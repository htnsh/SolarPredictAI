#!/usr/bin/env python3
"""
Test script to check if the solar power model can be loaded properly.
"""

import os
import sys
import traceback

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_model_loading():
    """Test if the model can be loaded successfully."""
    try:
        # Try to import joblib
        try:
            import joblib
            print("✓ joblib imported successfully")
        except ImportError as e:
            print(f"✗ Failed to import joblib: {e}")
            print("Please install joblib: pip install joblib")
            return False
        
        # Check if model file exists
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'solar_power_model.pkl')
        print(f"Model path: {model_path}")
        
        if not os.path.exists(model_path):
            print(f"✗ Model file not found at: {model_path}")
            return False
        else:
            print("✓ Model file exists")
        
        # Try to load the model
        try:
            model = joblib.load(model_path)
            print(f"✓ Model loaded successfully: {type(model)}")
            print(f"Model attributes: {dir(model)}")
            return True
        except Exception as e:
            print(f"✗ Failed to load model: {e}")
            print(f"Error details: {traceback.format_exc()}")
            return False
            
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        print(f"Error details: {traceback.format_exc()}")
        return False

if __name__ == "__main__":
    print("Testing solar power model loading...")
    print("=" * 50)
    
    success = test_model_loading()
    
    print("=" * 50)
    if success:
        print("✓ All tests passed! Model is ready to use.")
    else:
        print("✗ Some tests failed. Please fix the issues above.")
