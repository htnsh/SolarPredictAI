import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, BarChart3, Calendar, TrendingUp, Zap } from 'lucide-react';

const Reports: React.FC = () => {
  const reportTypes = [
    {
      title: 'Daily Energy Report',
      description: 'Detailed daily solar generation, consumption, and efficiency metrics',
      format: ['PDF', 'CSV'],
      size: '2.3 MB',
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Weekly Performance Summary',
      description: 'Weekly trends, weather impact, and performance comparison',
      format: ['PDF', 'Excel'],
      size: '1.8 MB',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Monthly Analytics Report',
      description: 'Comprehensive monthly analysis with predictions and recommendations',
      format: ['PDF', 'CSV'],
      size: '4.2 MB',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'System Health Report',
      description: 'Technical diagnostics, maintenance alerts, and system status',
      format: ['PDF'],
      size: '1.1 MB',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const quickStats = [
    { label: 'Reports Generated', value: '247', trend: '+12%' },
    { label: 'Data Points Analyzed', value: '1.2M', trend: '+8%' },
    { label: 'Predictions Made', value: '1,847', trend: '+15%' },
    { label: 'Accuracy Rate', value: '96.8%', trend: '+2%' },
  ];

  const handleDownload = (title: string, format: string) => {
    // Mock download functionality
    console.log(`Downloading ${title} in ${format} format`);
    // In a real app, this would trigger a file download
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Solar Analytics Reports
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Download comprehensive reports and analytics for your solar energy system performance.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
                >
                  {stat.value}
                </motion.div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {stat.label}
                </p>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reportTypes.map((report, index) => (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${report.color} flex items-center justify-center`}>
                  <report.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Size</span>
                  <p className="font-medium text-gray-900 dark:text-white">{report.size}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {report.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {report.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available Formats:
                  </span>
                  <div className="flex space-x-2">
                    {report.format.map((format) => (
                      <span
                        key={format}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 rounded-md"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  {report.format.map((format) => (
                    <motion.button
                      key={format}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDownload(report.title, format)}
                      className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 text-white font-medium hover:shadow-lg transition-all duration-300"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {format}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom Report Generator */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">
              Custom Report Generator
            </h2>
            <p className="opacity-90 max-w-2xl mx-auto">
              Need a specific report? Generate custom analytics reports with your preferred metrics, 
              date ranges, and format options.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 rounded-xl bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-all duration-300"
            >
              Create Custom Report
              <FileText className="w-5 h-5 ml-2" />
            </motion.button>
          </div>
        </motion.div>

        {/* Report Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Automated Report Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Daily Reports</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Every day at 6:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Weekly Summary</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Every Sunday at 9:00 AM</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Monthly Analytics</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">1st of each month</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;