import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ArrowRight, Zap, TrendingUp, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms predict solar energy output with 95% accuracy.',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Monitor and analyze your solar panel performance with live data visualization.',
    },
    {
      icon: Shield,
      title: 'Reliable & Secure',
      description: 'Enterprise-grade security with 99.9% uptime for continuous monitoring.',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-blue-900 dark:to-indigo-900 text-orange-800 dark:text-blue-200 text-sm font-medium"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  AI/ML Solar Energy Prediction
                </motion.div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Predict Solar Power
                  <span className="block bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Generation
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Harness the power of artificial intelligence to optimize your solar energy systems. 
                  Get accurate predictions, maximize efficiency, and contribute to a sustainable future.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/input')}
                  className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-orange-300 dark:border-blue-400 text-orange-600 dark:text-blue-400 font-semibold hover:bg-orange-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                >
                  View Dashboard
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px] flex items-center justify-center">
                {/* Animated Solar Panel/Moon */}
                <motion.div
                  animate={{
                    rotate: theme === 'light' ? 360 : 0,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="relative"
                >
                  {theme === 'light' ? (
                    <div className="relative">
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 blur-3xl opacity-50"
                      />
                      <Sun className="relative w-48 h-48 text-yellow-500 drop-shadow-2xl" />
                    </div>
                  ) : (
                    <div className="relative">
                      <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 blur-3xl opacity-40"
                      />
                      <Moon className="relative w-48 h-48 text-blue-300 drop-shadow-2xl" />
                      {/* Stars */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute w-2 h-2 bg-blue-200 rounded-full"
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Orbiting Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-8 left-8 w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 dark:from-blue-400 dark:to-indigo-400" />
                  <div className="absolute bottom-8 right-8 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-indigo-400 dark:to-blue-400" />
                  <div className="absolute top-1/2 right-4 w-3 h-3 rounded-full bg-gradient-to-r from-orange-300 to-yellow-300 dark:from-blue-300 dark:to-indigo-300" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Why Choose SolarPredict AI?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of solar energy management with our cutting-edge AI technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100 dark:border-blue-800"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;