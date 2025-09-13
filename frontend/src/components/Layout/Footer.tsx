import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Zap, Battery, MapPin } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-blue-900 border-t border-orange-200 dark:border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                animate={{ rotate: theme === 'light' ? 360 : 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-400 dark:to-indigo-600 flex items-center justify-center"
              >
                {theme === 'light' ? (
                  <Sun className="w-6 h-6 text-white" />
                ) : (
                  <Moon className="w-6 h-6 text-white" />
                )}
              </motion.div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                SolarPredict AI
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Advanced AI/ML-powered solar energy prediction system for optimizing renewable energy generation.
            </p>
            <div className="flex space-x-4">
              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-center space-x-2 text-orange-600 dark:text-blue-400"
              >
                <Zap className="w-5 h-5" />
                <span className="text-sm">Clean Energy</span>
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-center space-x-2 text-orange-600 dark:text-blue-400"
              >
                <Battery className="w-5 h-5" />
                <span className="text-sm">Sustainable</span>
              </motion.div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Dashboard', 'Predictions', 'Reports', 'About'].map((link) => (
                <li key={link}>
                  <motion.a
                    whileHover={{ x: 4 }}
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-blue-400"
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
            <div className="space-y-2">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Global Coverage</span>
              </motion.div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                support@solarpredict.ai
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-orange-200 dark:border-blue-800 mt-8 pt-8 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400">
            © 2025 SolarPredict AI. All rights reserved. Powered by renewable energy.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;