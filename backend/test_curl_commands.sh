# Test the info endpoint
curl -X GET http://localhost:8000/api/dashboard/info/

# Test the prediction endpoint
curl -X POST http://localhost:8000/api/dashboard/predict/ \
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
  }'

# Test the test endpoint
curl -X POST http://localhost:8000/api/dashboard/test-predict/ \
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
  }'
