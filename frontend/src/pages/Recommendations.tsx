import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Compass, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const iconMap: Record<string, any> = {
  'Optimal Tilt Angle': RotateCw,
  'Azimuth Orientation': Compass,
  'Seasonal Adjustment': TrendingUp,
};

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:8000/api/dashboard/recommendations/', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch recommendations');
        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const optimizationTips = [
    {
      title: 'Panel Cleaning Schedule',
      description: 'Clean panels monthly to maintain 95%+ efficiency. Dirty panels can lose 15-25% output.',
      impact: 'High',
    },
    {
      title: 'Shade Analysis',
      description: 'Monitor for new shade sources. Even 10% shading can reduce total output by 50%.',
      impact: 'Critical',
    },
    {
      title: 'Inverter Optimization',
      description: 'Consider micro-inverters for panels with partial shading or different orientations.',
      impact: 'Medium',
    },
    {
      title: 'Battery Storage',
      description: 'Adding 10kWh storage could increase self-consumption from 30% to 70%.',
      impact: 'High',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-orange-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'low':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'High':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'Low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
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
            System Optimization Recommendations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            AI-powered insights to maximize your solar energy generation and efficiency.
          </p>
        </motion.div>

        {/* Main Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            <div className="col-span-3 text-center py-8 text-gray-500">Loading recommendations...</div>
          ) : error ? (
            <div className="col-span-3 text-center py-8 text-red-500">{error}</div>
          ) : recommendations.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-gray-500">No recommendations available.</div>
          ) : recommendations.map((rec, index) => {
            const Icon = iconMap[rec.title] || CheckCircle;
            return (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getPriorityColor(rec.priority)} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rec.priority === 'high'
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : rec.priority === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                      : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  }`}>
                    {rec.priority.toUpperCase()} PRIORITY
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {rec.title}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{rec.current}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-orange-200 dark:border-blue-800">
                    <span className="text-sm text-orange-600 dark:text-blue-400">Recommended:</span>
                    <span className="font-medium text-orange-700 dark:text-blue-300">{rec.recommended}</span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="mb-4"
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {rec.improvement}
                  </span>
                </motion.div>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {rec.description}
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 text-white font-medium hover:shadow-lg transition-all duration-300"
                >
                  Apply Recommendation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Optimization Tips */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Additional Optimization Tips
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {optimizationTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300"
              >
                <AlertCircle className="w-5 h-5 text-orange-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {tip.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(tip.impact)}`}>
                      {tip.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tip.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 rounded-2xl p-8 text-white shadow-2xl"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Potential System Improvement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
                  className="text-4xl font-bold mb-2"
                >
                  +34%
                </motion.div>
                <p className="opacity-90">Total Efficiency Gain</p>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
                  className="text-4xl font-bold mb-2"
                >
                  +$485
                </motion.div>
                <p className="opacity-90">Annual Savings Increase</p>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
                  className="text-4xl font-bold mb-2"
                >
                  2.1 tons
                </motion.div>
                <p className="opacity-90">Extra CO₂ Saved/Year</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Recommendations;