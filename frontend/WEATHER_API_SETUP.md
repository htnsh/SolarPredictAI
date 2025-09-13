# Weather API Integration Setup

## Overview
The SolarPredictAI application now includes automatic weather data fetching to populate temperature, humidity, wind speed, and cloud cover fields when a user enters a location.

## Setup Instructions

### 1. Get Weather API Key
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Configure Environment Variables
1. Open the `.env` file in the `frontend` directory
2. Replace `your_api_key_here` with your actual OpenWeatherMap API key:

```env
# Weather API Configuration
VITE_WEATHER_API_URL=https://api.openweathermap.org/data/2.5/weather
VITE_WEATHER_API_KEY=your_actual_api_key_here

# Solar Prediction API Configuration
VITE_SOLAR_API_URL=http://localhost:8000/api/dashboard
```

### 3. How It Works

#### Automatic Weather Fetching
- When a user types a city name in the "Location" field, the app automatically fetches weather data after 1 second of inactivity
- The following fields are automatically populated:
  - **Temperature** (°C)
  - **Humidity** (%)
  - **Wind Speed** (m/s)
  - **Cloud Cover** (mapped from weather description)
  - **Solar Irradiance** (estimated based on weather conditions)

#### Weather to Cloud Cover Mapping
- Clear/Sunny → "Fluffy white clouds"
- Few/Scattered clouds → "Thin high clouds"
- Broken/Partly cloudy → "Mid-level clouds"
- Overcast/Cloudy → "Thick low clouds"
- Storm/Thunderstorm → "Thick low clouds"

#### Solar Irradiance Estimation
- Clear skies: 800 W/m²
- Few clouds: 600 W/m²
- Partly cloudy: 400 W/m²
- Overcast: 200 W/m²
- Storms: 100 W/m²

### 4. Error Handling
The app includes comprehensive error handling for:
- Invalid API key
- City not found
- Network connectivity issues
- API rate limits

### 5. User Experience Features
- **Loading indicators** while fetching weather data
- **Success messages** when weather data is loaded
- **Error messages** with helpful suggestions
- **Debounced requests** to avoid excessive API calls
- **Disabled submit button** during prediction generation

## API Endpoints Used

### Weather API
- **URL**: `https://api.openweathermap.org/data/2.5/weather`
- **Method**: GET
- **Parameters**: `q={city}&appid={api_key}&units=metric`

### Solar Prediction API
- **URL**: `http://localhost:8000/api/dashboard/predict/`
- **Method**: POST
- **Body**: JSON with solar panel parameters

## Testing
1. Start your Django backend: `python manage.py runserver`
2. Start your React frontend: `npm run dev`
3. Navigate to the Input page
4. Enter a city name (e.g., "London", "New York", "Tokyo")
5. Watch the weather fields auto-populate
6. Fill in the remaining solar panel parameters
7. Click "Generate Predictions" to get AI-powered solar predictions

## Troubleshooting

### Common Issues
1. **"Weather API key not configured"**
   - Make sure you've added your API key to the `.env` file
   - Restart your development server after updating `.env`

2. **"City not found"**
   - Check the spelling of the city name
   - Try using the format "City, Country" (e.g., "London, UK")

3. **"Invalid API key"**
   - Verify your API key is correct
   - Make sure your OpenWeatherMap account is active

4. **Network errors**
   - Check your internet connection
   - Verify the weather API is accessible

### Development Notes
- The `.env` file is already included in `.gitignore`
- Weather data is cached for 1 second to prevent excessive API calls
- All API calls include proper error handling and user feedback
- The app gracefully handles API failures and provides fallback options
