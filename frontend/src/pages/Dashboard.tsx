import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, TrendingUp, Battery, Sun, Calendar, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Mock data for demonstration
  const timeSeriesData = [
    { time: '06:00', power: 0, temperature: 18 },
    { time: '08:00', power: 1.2, temperature: 22 },
    { time: '10:00', power: 3.5, temperature: 26 },
    { time: '12:00', power: 5.8, temperature: 30 },
    { time: '14:00', power: 6.2, temperature: 32 },
    { time: '16:00', power: 4.1, temperature: 28 },
    { time: '18:00', power: 1.8, temperature: 24 },
    { time: '20:00', power: 0, temperature: 20 },
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

  const stats = [
    {
      title: 'Current Output',
      value: '6.2 kW',
      change: '+12%',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
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
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Sun Hours',
      value: '8.4 hrs',
      change: '+5%',
      icon: Sun,
      color: 'from-orange-500 to-red-500',
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

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Solar Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time monitoring and AI-powered predictions for your solar system
          </p>
        </motion.div>

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
              <Activity className="w-6 h-6 text-orange-500 dark:text-blue-400" />
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
                1,247 kWh
              </motion.h3>
              <p className="opacity-90">Monthly Prediction</p>
            </div>
            <div>
              <motion.h3
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                className="text-3xl font-bold mb-2"
              >
                $189
              </motion.h3>
              <p className="opacity-90">Estimated Savings</p>
            </div>
            <div>
              <motion.h3
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                className="text-3xl font-bold mb-2"
              >
                96.8%
              </motion.h3>
              <p className="opacity-90">Prediction Accuracy</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;