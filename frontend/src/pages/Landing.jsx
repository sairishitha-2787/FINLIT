// FINLIT Landing Page
// Entry point for new users

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/shared/Button';

const Landing = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo/Title */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                FINLIT
              </span>
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🧠💰
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-4xl font-semibold text-white mb-4"
          >
            Financial Literacy Made Personal
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Learn finance through what you love. Whether it's gaming, sports, fashion, or music -
            we'll teach you money management using your interests.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <FeatureCard
              icon="🎯"
              title="Personalized Learning"
              description="Finance explained through your interests"
              delay={0.9}
            />
            <FeatureCard
              icon="🎮"
              title="Interactive Quizzes"
              description="Test your knowledge with fun challenges"
              delay={1.0}
            />
            <FeatureCard
              icon="📈"
              title="Track Progress"
              description="See your financial knowledge grow"
              delay={1.1}
            />
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Button
              onClick={handleStart}
              variant="primary"
              size="lg"
              className="text-xl px-12 py-5 shadow-2xl"
            >
              Start Your Journey 🚀
            </Button>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-sm text-gray-400 mt-8"
          >
            Takes only 2 minutes to get started
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="bg-dark-light/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 hover:border-primary/50 transition-all duration-300"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default Landing;
