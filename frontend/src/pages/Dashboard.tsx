import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, TrendingUp, Battery, Sun, Calendar, Activity, MapPin, Thermometer, Droplets, Wind, Cloud, RotateCw, Compass, AlertCircle, Trash2, RefreshCw, LogIn } from 'lucide-react';
import { userPredictionService, UserPrediction, UserPredictionStats } from '../services/userPredictionService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  // Download report handler
  const handleDownloadReport = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You must be logged in to download reports.');
      return;
    }
    // Prompt for format and period
    const format = window.prompt('Enter format (csv or pdf):', 'csv')?.toLowerCase() || 'csv';
    const period = window.prompt('Enter period (daily, weekly, monthly):', 'daily')?.toLowerCase() || 'daily';
    try {
      const apiUrl = import.meta.env.VITE_SOLAR_API_URL || 'http://localhost:8000/api/dashboard';
      const url = `${apiUrl}/export-report/?format=${format}&period=${period}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        alert('Failed to download report.');
        return;
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `solar_report_${period}_${new Date().toISOString().slice(0,10)}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert('Error downloading report.');
      console.error(err);
    }
  };
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
  const [latestPrediction, setLatestPrediction] = useState<UserPrediction | null>(null);
  const [predictionStats, setPredictionStats] = useState<UserPredictionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Load user predictions from MongoDB
  useEffect(() => {
    if (!user) return; // Don't load data if user is not authenticated
    
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load latest prediction, all predictions, and stats in parallel
        const [latestResult, predictionsResult, statsResult] = await Promise.all([
          userPredictionService.getLatestPrediction(),
          userPredictionService.getUserPredictions(10, 0),
          userPredictionService.getPredictionStats()
        ]);

        // Handle latest prediction
        if ('message' in latestResult) {
          if (latestResult.code === 'NOT_FOUND') {
            setLatestPrediction(null);
          } else {
            setError(latestResult.message);
          }
        } else {
          setLatestPrediction(latestResult);
        }

        // Handle predictions list
        if ('message' in predictionsResult) {
          setError(predictionsResult.message);
        } else {
          setUserPredictions(predictionsResult);
        }

        // Handle stats
        if ('message' in statsResult) {
          setError(statsResult.message);
        } else {
          setPredictionStats(statsResult);
        }

      } catch (err) {
        setError('Failed to load prediction data');
        console.error('Error loading user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);


  // Dummy static data for the time series graph
  const timeSeriesData = [
    { time: '06:00', power: 0 },
    { time: '08:00', power: 1.2 },
    { time: '10:00', power: 3.5 },
    { time: '12:00', power: 5.8 },
    { time: '14:00', power: 6.2 },
    { time: '16:00', power: 4.1 },
    { time: '18:00', power: 1.8 },
    { time: '20:00', power: 0 },
  ];

  const barData = {
    daily: [
      { name: 'Mon', generation: 28.5, consumption: 24.2 },
      { name: 'Tue', generation: 32.1, consumption: 26.8 },
      { name: 'Wed', generation: 29.8, consumption: 25.4 },
      { name: 'Thu', generation: 35.2, consumption: 28.1 },
      { name: 'Fri', generation: 31.7, consumption: 27.3 },
      { name: 'Sat', generation: 28.9, consumption: 23.6 },
      { name: 'Sun', generation: 33.4, consumption: 25.9 },
    ],
    weekly: [
      { name: 'Week 1', generation: 215.6, consumption: 182.3 },
      { name: 'Week 2', generation: 198.4, consumption: 174.8 },
      { name: 'Week 3', generation: 234.7, consumption: 201.2 },
      { name: 'Week 4', generation: 221.9, consumption: 189.7 },
    ],
    monthly: [
      { name: 'Jan', generation: 856.2, consumption: 742.1 },
      { name: 'Feb', generation: 923.8, consumption: 798.4 },
      { name: 'Mar', generation: 1024.3, consumption: 876.9 },
      { name: 'Apr', generation: 1156.7, consumption: 945.2 },
      { name: 'May', generation: 1298.4, consumption: 1021.8 },
      { name: 'Jun', generation: 1387.9, consumption: 1156.3 },
    ],
  };

  // Calculate stats based on real prediction data
  const stats = latestPrediction ? [
    {
      title: 'Latest Prediction',
      value: `${latestPrediction.prediction.predicted_power_generated.toFixed(2)} kW`,
      change: 'AI Prediction',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500 dark:from-blue-500 dark:to-indigo-500',
    },
    {
      title: 'Panel Area',
      value: `${latestPrediction.prediction.input_parameters.panel_area} m²`,
      change: 'Configured',
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Temperature',
      value: `${latestPrediction.prediction.input_parameters.temperature}°C`,
      change: 'Current',
      icon: Battery,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Solar Irradiance',
      value: `${latestPrediction.prediction.input_parameters.ghi} W/m²`,
      change: 'Current',
      icon: Sun,
      color: 'from-orange-500 to-red-500',
    },
  ] : [
    {
      title: 'Current Output',
      value: '6.2 kW',
      change: '+12%',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500 dark:from-blue-500 dark:to-indigo-500',
    },
    {
      title: 'Daily Prediction',
      value: '45.8 kWh',
      change: '+8%',
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Efficiency',
      value: '94.2%',
      change: '+2%',
      icon: Battery,
      color: 'from-green-500 to-emerald-500 dark:from-blue-500 dark:to-indigo-500',
    },
    {
      title: 'Sun Hours',
      value: '8.4 hrs',
      change: '+5%',
      icon: Sun,
      color: 'from-orange-500 to-red-500 dark:from-blue-500 dark:to-indigo-500',
    },
  ];

  const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
    return (
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={value}
        className="text-2xl font-bold"
      >
        {value}
      </motion.span>
    );
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
            <LogIn className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Please log in to view your solar predictions and dashboard.
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

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading your predictions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Solar Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {latestPrediction ? 'Your AI-powered solar predictions' : 'Real-time monitoring and AI-powered predictions for your solar system'}
              </p>
            </div>
            <div className="flex flex-col gap-3 items-end">
              <button
                onClick={handleDownloadReport}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                <span>Download Report</span>
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-indigo-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 dark:text-red-300 font-medium">
                {error}
              </span>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </h3>
              <AnimatedCounter value={stat.value} />
            </motion.div>
          ))}
        </div>

        {/* User Predictions History */}
        {userPredictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Prediction History
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {userPredictions.length} prediction{userPredictions.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-4">
                {userPredictions.map((prediction, index) => (
                  <motion.div
                    key={prediction._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-500 dark:to-indigo-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {prediction.prediction.predicted_power_generated.toFixed(2)} kW
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-white">
                          {prediction.input_data.location} • {new Date(prediction.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-white">
                          Panel: {prediction.input_data.panelArea}m² • Tilt: {prediction.input_data.tilt}° • Azimuth: {prediction.input_data.azimuth}°
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(prediction.created_at).toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this prediction?')) {
                            // TODO: Implement delete functionality
                            console.log('Delete prediction:', prediction._id);
                          }
                        }}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* No Predictions Message */}
        {!isLoading && userPredictions.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Predictions Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Create your first solar prediction to see your history here.
              </p>
              <a
                href="/input"
                className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Create Prediction
              </a>
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Time Series Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Today's Power Generation
              </h2>
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-orange-500 dark:text-blue-400" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="power"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#f59e0b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generation vs Consumption
              </h2>
              <div className="flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-orange-500 dark:text-blue-400" />
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as typeof activeTab)}
                  className="bg-transparent border-none text-sm font-medium text-gray-600 dark:text-gray-300 focus:outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData[activeTab]}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="generation"
                  name="Generation"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="consumption"
                  name="Consumption"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Prediction Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <motion.h3
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                className="text-3xl font-bold mb-2"
              >
                {latestPrediction 
                  ? `${(latestPrediction.prediction.predicted_power_generated * 24).toFixed(0)} kWh`
                  : '1,247 kWh'
                }
              </motion.h3>
              <p className="opacity-90">Daily Prediction</p>
            </div>
            <div>
              <motion.h3
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                className="text-3xl font-bold mb-2"
              >
                {latestPrediction 
                  ? `$${((latestPrediction.prediction.predicted_power_generated * 24 * 0.12)).toFixed(0)}`
                  : '$189'
                }
              </motion.h3>
              <p className="opacity-90">Daily Savings</p>
            </div>
            <div>
              <motion.h3
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                className="text-3xl font-bold mb-2"
              >
                {predictionStats 
                  ? `${predictionStats.total_predictions}`
                  : '0'
                }
              </motion.h3>
              <p className="opacity-90">Total Predictions</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;