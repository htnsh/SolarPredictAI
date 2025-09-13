import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, RotateCw, Compass, ArrowRight } from 'lucide-react';

interface FormData {
  location: string;
  latitude: string;
  longitude: string;
  panelArea: string;
  tilt: string;
  azimuth: string;
}

const Input: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    location: '',
    latitude: '',
    longitude: '',
    panelArea: '',
    tilt: '',
    azimuth: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store form data in localStorage or context
    localStorage.setItem('solarInputData', JSON.stringify(formData));
    navigate('/dashboard');
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
      name: 'latitude',
      label: 'Latitude',
      icon: MapPin,
      placeholder: 'e.g., 37.7749',
      type: 'number',
      step: 'any',
    },
    {
      name: 'longitude',
      label: 'Longitude',
      icon: MapPin,
      placeholder: 'e.g., -122.4194',
      type: 'number',
      step: 'any',
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="inline-flex items-center px-12 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Generate Predictions
              <ArrowRight className="w-6 h-6 ml-2" />
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
              <li>• Use precise latitude/longitude coordinates for your location</li>
              <li>• Optimal tilt angle is typically equal to your latitude</li>
              <li>• Azimuth of 180° (south-facing) is ideal in the Northern Hemisphere</li>
              <li>• Include shading factors and panel efficiency in your calculations</li>
            </ul>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default Input;