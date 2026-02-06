// FINLIT Dashboard Page - Neo-Brutalist Edition
// Main hub with Bento Grid layout

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getRecommendations } from '../services/api';
import BentoDashboard from '../components/dashboard/BentoDashboard';
import XPPopup from '../components/shared/XPPopup';
import FloatingMentor from '../components/mentor/FloatingMentor';
import LoadingAnimation from '../components/shared/LoadingAnimation';
import useGamification from '../hooks/useGamification';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, stats, completedTopics } = useUser();
  const { xpPopups } = useGamification();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchRecommendations();
    }
  }, [profile, completedTopics]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await getRecommendations(
        profile.difficulty,
        completedTopics
      );
      if (response.success) {
        setRecommendations(response.recommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTopic = (topic) => {
    navigate('/learning', { state: { topic } });
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-brutal-bg flex items-center justify-center">
        <LoadingAnimation message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brutal-bg p-4 md:p-8">
      {/* XP Popups */}
      <XPPopup popups={xpPopups} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-brutal-black border-4 border-brutal-black shadow-brutal rounded-none p-6 mb-6">
          <h1 className="text-5xl md:text-6xl font-black text-brutal-green mb-2">
            FINLIT
          </h1>
          <p className="text-2xl text-brutal-white font-bold">
            Welcome back, {profile.name}! 👋
          </p>
        </div>
      </motion.div>

      {/* Bento Grid Dashboard */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingAnimation message="Loading your personalized dashboard..." />
        </div>
      ) : (
        <BentoDashboard
          recommendations={recommendations.length > 0 ? recommendations : ['Budgeting Basics', 'Saving Money', 'Credit Scores']}
          onStartTopic={handleStartTopic}
        />
      )}

      {/* Floating Mentor */}
      <FloatingMentor
        currentTopic={recommendations[0] || 'Budgeting Basics'}
        userInterest={profile.primaryInterest}
      />
    </div>
  );
};

export default Dashboard;
