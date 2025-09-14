// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { MapPin, Zap, RotateCw, Compass, ArrowRight } from 'lucide-react';

// interface FormData {
//   location: string;
//   latitude: string;
//   longitude: string;
//   panelArea: string;
//   tilt: string;
//   azimuth: string;
// }

// const Input: React.FC = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<FormData>({
//     location: '',
//     latitude: '',
//     longitude: '',
//     panelArea: '',
//     tilt: '',
//     azimuth: '',
//   });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Store form data in localStorage or context
//     localStorage.setItem('solarInputData', JSON.stringify(formData));
//     navigate('/dashboard');
//   };

//   const inputFields = [
//     {
//       name: 'location',
//       label: 'Location (City)',
//       icon: MapPin,
//       placeholder: 'e.g., San Francisco, CA',
//       type: 'text',
//     },
//     {
//       name: 'latitude',
//       label: 'Latitude',
//       icon: MapPin,
//       placeholder: 'e.g., 37.7749',
//       type: 'number',
//       step: 'any',
//     },
//     {
//       name: 'longitude',
//       label: 'Longitude',
//       icon: MapPin,
//       placeholder: 'e.g., -122.4194',
//       type: 'number',
//       step: 'any',
//     },
//     {
//       name: 'panelArea',
//       label: 'Panel Area (m²)',
//       icon: Zap,
//       placeholder: 'e.g., 50',
//       type: 'number',
//       min: '1',
//     },
//     {
//       name: 'tilt',
//       label: 'Tilt Angle (degrees)',
//       icon: RotateCw,
//       placeholder: 'e.g., 30',
//       type: 'number',
//       min: '0',
//       max: '90',
//     },
//     {
//       name: 'azimuth',
//       label: 'Azimuth Angle (degrees)',
//       icon: Compass,
//       placeholder: 'e.g., 180',
//       type: 'number',
//       min: '0',
//       max: '360',
//     },
//   ];

//   return (
//     <div className="py-20">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center space-y-4 mb-12"
//         >
//           <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
//             Solar System Configuration
//           </h1>
//           <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//             Enter your solar panel system details to get accurate AI-powered predictions.
//           </p>
//         </motion.div>

//         <motion.form
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           onSubmit={handleSubmit}
//           className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-orange-100 dark:border-blue-800"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {inputFields.map((field, index) => (
//               <motion.div
//                 key={field.name}
//                 initial={{ opacity: 0, x: -50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                 className="space-y-2"
//               >
//                 <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
//                   <field.icon className="w-4 h-4 text-orange-500 dark:text-blue-400" />
//                   <span>{field.label}</span>
//                 </label>
//                 <motion.input
//                   whileFocus={{ scale: 1.02 }}
//                   type={field.type}
//                   name={field.name}
//                   value={formData[field.name as keyof FormData]}
//                   onChange={handleInputChange}
//                   placeholder={field.placeholder}
//                   min={field.min}
//                   max={field.max}
//                   step={field.step}
//                   required
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-orange-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-blue-800 transition-all duration-300"
//                 />
//               </motion.div>
//             ))}
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.8 }}
//             className="mt-12 text-center"
//           >
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               type="submit"
//               className="inline-flex items-center px-12 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               Generate Predictions
//               <ArrowRight className="w-6 h-6 ml-2" />
//             </motion.button>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1 }}
//             className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-orange-200 dark:border-blue-800"
//           >
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//               💡 Tips for Better Accuracy
//             </h3>
//             <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
//               <li>• Use precise latitude/longitude coordinates for your location</li>
//               <li>• Optimal tilt angle is typically equal to your latitude</li>
//               <li>• Azimuth of 180° (south-facing) is ideal in the Northern Hemisphere</li>
//               <li>• Include shading factors and panel efficiency in your calculations</li>
//             </ul>
//           </motion.div>
//         </motion.form>
//       </div>
//     </div>
//   );
// };

// export default Input;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, RotateCw, Compass, ArrowRight, Droplets, Thermometer, Sun, Wind, Cloud, Loader2, AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { weatherService, WeatherData } from '../services/weatherService';
import { solarPredictionService, SolarPredictionRequest } from '../services/solarPredictionService';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  location: string;
  humidity: string;
  temperature: string;
  date: string;
  time: string;
  solarIrradiance: string;
  windSpeed: string;
  cloudCover: string;
  panelArea: string;
  tilt: string;
  azimuth: string;
}

const Input: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    location: '',
    humidity: '',
    temperature: '',
    date: '',
    time: '',
    solarIrradiance: '',
    windSpeed: '',
    cloudCover: '',
    panelArea: '',
    tilt: '',
    azimuth: '',
  });

  // Loading and error states
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [weatherSuccess, setWeatherSuccess] = useState<string | null>(null);
  const [isGeneratingPrediction, setIsGeneratingPrediction] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch weather data when location changes
  const fetchWeatherData = async (city: string) => {
    if (!city.trim()) {
      setWeatherError(null);
      setWeatherSuccess(null);
      return;
    }

    setIsLoadingWeather(true);
    setWeatherError(null);
    setWeatherSuccess(null);

    try {
      const result = await weatherService.getWeatherByCity(city);
      
      if ('message' in result) {
        // Error case
        setWeatherError(result.message);
      } else {
        // Success case
        const weatherData = result as WeatherData;
        
        // Update form data with weather information
        setFormData(prev => ({
          ...prev,
          temperature: weatherData.temperature.toString(),
          humidity: weatherData.humidity.toString(),
          windSpeed: weatherData.windSpeed.toString(),
          cloudCover: weatherService.mapWeatherToCloudCover(weatherData.description, weatherData.cloudCover),
          solarIrradiance: weatherData.solarIrradiance.toString()
        }));

        setWeatherSuccess(`Weather data loaded for ${weatherData.city}: ${weatherData.description}`);
      }
    } catch (error) {
      setWeatherError('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Debounced weather fetching
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.location) {
        fetchWeatherData(formData.location);
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [formData.location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['panelArea', 'tilt', 'azimuth', 'solarIrradiance', 'temperature', 'humidity', 'windSpeed', 'cloudCover'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
    
    if (missingFields.length > 0) {
      setWeatherError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsGeneratingPrediction(true);
    setWeatherError(null);

    try {
      // Prepare prediction request
      const predictionRequest: SolarPredictionRequest = {
        panel_area: parseFloat(formData.panelArea),
        tilt: parseFloat(formData.tilt),
        azimuth: parseFloat(formData.azimuth),
        ghi: parseFloat(formData.solarIrradiance),
        dni: parseFloat(formData.solarIrradiance) * 0.8, // Estimate DNI as 80% of GHI
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        wind_speed: parseFloat(formData.windSpeed),
        cloud_cover: formData.cloudCover
      };

      // Get solar prediction
      const result = await solarPredictionService.getSolarPrediction(predictionRequest);
      
      if ('message' in result) {
        // Error case
        setWeatherError(result.message);
      } else {
        // Success case - store both input data and prediction result
        const predictionData = {
          inputData: formData,
          prediction: result,
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('solarInputData', JSON.stringify(predictionData));
        navigate('/dashboard');
      }
    } catch (error) {
      setWeatherError('Failed to generate solar prediction. Please try again.');
    } finally {
      setIsGeneratingPrediction(false);
    }
  };

  const inputFields = [
    {
      name: 'location',
      label: 'Location (City)',
      icon: MapPin,
      placeholder: 'e.g., San Francisco, CA',
      type: 'text',
    },
    {
      name: 'humidity',
      label: 'Humidity (%)',
      icon: Droplets,
      placeholder: 'e.g., 65',
      type: 'number',
      min: '0',
      max: '100',
    },
    {
      name: 'temperature',
      label: 'Temperature (°C)',
      icon: Thermometer,
      placeholder: 'e.g., 25',
      type: 'number',
      step: '0.1',
    },
    {
      name: 'date',
      label: 'Date',
      icon: Sun,
      placeholder: '',
      type: 'date',
    },
    {
      name: 'time',
      label: 'Time',
      icon: Sun,
      placeholder: '',
      type: 'time',
    },
    {
      name: 'solarIrradiance',
      label: 'Solar Irradiance (W/m²)',
      icon: Sun,
      placeholder: 'e.g., 800',
      type: 'number',
      min: '0',
    },
    {
      name: 'windSpeed',
      label: 'Wind Speed (m/s)',
      icon: Wind,
      placeholder: 'e.g., 3.5',
      type: 'number',
      min: '0',
      step: '0.1',
    },
    {
      name: 'cloudCover',
      label: 'Cloud Cover',
      icon: Cloud,
      placeholder: 'Select cloud type',
      type: 'select',
      options: [
        'Thin high clouds',
        'Mid-level clouds',
        'Fluffy white clouds',
        'Thick low clouds',
        'Storm clouds'
      ],
    },
    {
      name: 'panelArea',
      label: 'Panel Area (m²)',
      icon: Zap,
      placeholder: 'e.g., 50',
      type: 'number',
      min: '1',
    },
    {
      name: 'tilt',
      label: 'Tilt Angle (degrees)',
      icon: RotateCw,
      placeholder: 'e.g., 30',
      type: 'number',
      min: '0',
      max: '90',
    },
    {
      name: 'azimuth',
      label: 'Azimuth Angle (degrees)',
      icon: Compass,
      placeholder: 'e.g., 180',
      type: 'number',
      min: '0',
      max: '360',
    },
  ];

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
            <LogIn className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please log in to create solar predictions and access your dashboard.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Solar System Configuration
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Enter your solar panel system details to get accurate AI-powered predictions.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-orange-100 dark:border-blue-800"
        >
          {/* Weather Status Indicators */}
          {isLoadingWeather && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center space-x-3">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Fetching weather data for {formData.location}...
                </span>
              </div>
            </motion.div>
          )}

          {weatherError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 dark:text-red-300 font-medium">
                  {weatherError}
                </span>
              </div>
            </motion.div>
          )}

          {weatherSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  {weatherSuccess}
                </span>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {inputFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-2"
              >
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <field.icon className="w-4 h-4 text-orange-500 dark:text-blue-400" />
                  <span>{field.label}</span>
                </label>
                {field.type === 'select' ? (
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    name={field.name}
                    value={formData[field.name as keyof FormData]}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-blue-800 transition-all duration-300"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </motion.select>
                ) : (
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof FormData]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-orange-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-orange-200 dark:focus:ring-blue-800 transition-all duration-300"
                  />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: isGeneratingPrediction ? 1 : 1.05 }}
              whileTap={{ scale: isGeneratingPrediction ? 1 : 0.95 }}
              type="submit"
              disabled={isGeneratingPrediction}
              className={`inline-flex items-center px-12 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 ${
                isGeneratingPrediction
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 hover:shadow-xl'
              } text-white`}
            >
              {isGeneratingPrediction ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Generating Predictions...
                </>
              ) : (
                <>
                  Generate Predictions
                  <ArrowRight className="w-6 h-6 ml-2" />
                </>
              )}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-orange-200 dark:border-blue-800"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              💡 Tips for Better Accuracy
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Enter a city name to automatically fetch current weather data</li>
              <li>• Weather data will auto-populate temperature, humidity, wind speed, and cloud cover</li>
              <li>• Optimal tilt angle is typically equal to your latitude</li>
              <li>• Azimuth of 180° (south-facing) is ideal in the Northern Hemisphere</li>
              <li>• Solar irradiance is estimated based on weather conditions</li>
            </ul>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default Input;
