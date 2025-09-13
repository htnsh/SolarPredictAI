import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Brain, Users, Award, Mail, MapPin, Phone, Zap, Leaf, Target } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const About: React.FC = () => {
  const { theme } = useTheme();

  const teamMembers = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Lead AI Scientist',
      image: 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'PhD in Machine Learning with 8+ years in renewable energy optimization.',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Solar Energy Engineer',
      image: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Expert in photovoltaic systems and energy forecasting with 12+ years experience.',
    },
    {
      name: 'Emily Watson',
      role: 'Data Science Lead',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Specialized in weather pattern analysis and predictive modeling for clean energy.',
    },
    {
      name: 'David Kim',
      role: 'Full-Stack Developer',
      image: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Building scalable web applications for renewable energy management systems.',
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: '96.8% Prediction Accuracy',
      description: 'Industry-leading AI model performance',
    },
    {
      icon: Users,
      title: '50,000+ Users',
      description: 'Trusted by solar installers worldwide',
    },
    {
      icon: Zap,
      title: '2.5 GWh Optimized',
      description: 'Total energy generation optimized',
    },
    {
      icon: Leaf,
      title: '1,250 Tons CO₂ Saved',
      description: 'Environmental impact through optimization',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'Pushing the boundaries of AI in renewable energy',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Committed to a carbon-neutral future',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Empowering individuals and organizations',
    },
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <motion.div
              animate={{ rotate: theme === 'light' ? 360 : 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-400 dark:to-indigo-600 flex items-center justify-center"
            >
              {theme === 'light' ? (
                <Sun className="w-8 h-8 text-white" />
              ) : (
                <Moon className="w-8 h-8 text-white" />
              )}
            </motion.div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              About SolarPredict AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We're pioneering the future of solar energy through advanced artificial intelligence and machine learning. 
            Our mission is to maximize renewable energy efficiency and accelerate the transition to sustainable power systems.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 rounded-3xl p-12 text-white mb-16 shadow-2xl"
        >
          <div className="text-center space-y-6">
            <Brain className="w-16 h-16 mx-auto opacity-80" />
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              To democratize clean energy through intelligent prediction systems that optimize solar power generation, 
              reduce costs, and contribute to a sustainable future for all.
            </p>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                <motion.h3
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: 'spring', stiffness: 200 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  {achievement.title}
                </motion.h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-center">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 dark:text-blue-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Values */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Get In Touch
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Ready to optimize your solar energy system? Our team of experts is here to help you 
                harness the full potential of AI-powered solar predictions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                    <p className="text-gray-600 dark:text-gray-300">support@solarpredict.ai</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-orange-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                    <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-SOLAR</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Location</p>
                    <p className="text-gray-600 dark:text-gray-300">Global Remote Team</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{
                    rotate: theme === 'light' ? 360 : 0,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-blue-600 dark:to-indigo-600 flex items-center justify-center mx-auto mb-4"
                >
                  {theme === 'light' ? (
                    <Sun className="w-16 h-16 text-white" />
                  ) : (
                    <Moon className="w-16 h-16 text-white" />
                  )}
                </motion.div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Powering the future with intelligent solar solutions
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;