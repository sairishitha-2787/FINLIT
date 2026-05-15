// FINLIT Dashboard Page — routes to domain-specific UIs when applicable
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Hand, Rocket, BarChart2, ChevronRight, Trophy } from 'lucide-react';
import AnimatedIcon from '../components/shared/AnimatedIcon';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { getSmartRecommendations } from '../services/api';
import BentoDashboard from '../components/dashboard/BentoDashboard';
import PlaceholderDomain from '../components/shared/PlaceholderDomain';
import XPPopup from '../components/shared/XPPopup';
import FloatingMentor from '../components/mentor/FloatingMentor';
import LoadingAnimation from '../components/shared/LoadingAnimation';
import WelcomeTour from '../components/dashboard/WelcomeTour';
import useGamification from '../hooks/useGamification';
import LogoutConfirmModal from '../components/shared/LogoutConfirmModal';

// Domains that have a dedicated, fully-built UI
const BUILT_DOMAINS = ['gaming', 'fashion'];
// Domains with partial content but no dedicated layout yet
const GENERIC_INTERESTS = ['general', 'finance', null, undefined];

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, stats, completedTopics } = useUser();
  const { user, logout } = useAuth();
  const { xpPopups } = useGamification();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Detect first-ever dashboard visit for this user
  useEffect(() => {
    if (!user || !profile) return;
    const key = `finlit_visited_${user.id}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '1');
      setIsFirstVisit(true);
      setShowTour(true);
    }
  }, [user?.id, profile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (profile) fetchRecommendations();
  }, [profile, completedTopics]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const savedProgress = JSON.parse(localStorage.getItem('finlit_progress') || '{}');
      const avgScore = savedProgress.avgScore || stats?.avgScore || 0;
      const goals = profile.goals || [];
      const response = await getSmartRecommendations({
        completedTopics,
        interest: profile.primaryInterest || 'general',
        difficulty: profile.difficulty || 'beginner',
        avgScore,
        goals,
        limit: 5,
      });
      if (response.success) setRecommendations(response.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTopic = (topic) => navigate('/learning', { state: { topic } });

  if (!profile) {
    return (
      <div className="min-h-screen gl-page flex items-center justify-center">
        <LoadingAnimation message="Loading your dashboard..." />
      </div>
    );
  }

  // Domain-specific dashboards — redirect into the domain's layout shell
  const interest = profile.primaryInterest?.toLowerCase();
  if (interest === 'gaming')  { navigate('/gaming',  { replace: true }); return null; }
  if (interest === 'fashion') { navigate('/fashion', { replace: true }); return null; }
  if (interest === 'sports')  { navigate('/sports',  { replace: true }); return null; }

  // Whether to show a "coming soon" domain section below the main dashboard
  const showDomainPlaceholder = interest && !BUILT_DOMAINS.includes(interest) && !GENERIC_INTERESTS.includes(interest);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(135deg, #EAF6FF 0%, #F0F4FF 50%, #FFFFFF 100%)' }}>
      <XPPopup popups={xpPopups} />

      {showTour && (
        <WelcomeTour userName={profile.name} onDone={() => setShowTour(false)} />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 mb-4 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-1">
                FINLIT
              </h1>
              <p className="text-lg text-slate-600 font-semibold flex items-center gap-2">
                {isFirstVisit
                  ? <><AnimatedIcon icon={PartyPopper} size={22} animation="bounce" className="text-blue-500" /> Welcome to FINLIT, {profile.name}!</>
                  : <><AnimatedIcon icon={Hand} size={22} animation="wiggle" className="text-slate-400" /> Welcome back, {profile.name}!</>}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => navigate('/progress')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <BarChart2 size={14} strokeWidth={2} /> Progress
              </button>
              <button
                onClick={() => {
                  if (user?.id) localStorage.removeItem(`finlit_ob_done_${user.id}`);
                  navigate('/onboarding');
                }}
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 text-sm rounded-xl border border-slate-200 transition-colors"
                title="Re-run onboarding to change your interest domain"
              >
                Change Domain
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 text-sm rounded-xl border border-slate-200 transition-colors"
              >
                Logout
              </button>
              <LogoutConfirmModal
                open={showLogoutConfirm}
                domain="default"
                onConfirm={async () => { await logout(); navigate('/login', { replace: true }); }}
                onCancel={() => setShowLogoutConfirm(false)}
              />
            </div>
          </div>
        </div>

        {/* First-visit banner */}
        <AnimatePresence>
          {isFirstVisit && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AnimatedIcon icon={Rocket} size={20} animation="float" className="text-emerald-500 shrink-0" />
                  <p className="font-semibold text-emerald-800 text-sm">
                    You're all set! Your dashboard is personalized to your interests. Watch the tour below to get started.
                  </p>
                </div>
                <button
                  onClick={() => setIsFirstVisit(false)}
                  className="shrink-0 text-emerald-400 hover:text-emerald-600 font-bold text-lg leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          onOpenMentor={() => setMentorOpen(true)}
        />
      )}

      {/* Domain Placeholder — polished "coming soon" for unbuilt interest domains */}
      {!loading && showDomainPlaceholder && (
        <div className="mt-6">
          <PlaceholderDomain
            domain={interest}
            onStartLearning={() => handleStartTopic(
              typeof recommendations[0] === 'string'
                ? recommendations[0]
                : recommendations[0]?.name || 'Budgeting Basics'
            )}
          />
        </div>
      )}

      {/* Progress Summary Strip */}
      {!loading && completedTopics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 bg-slate-900 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto shadow-sm"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Trophy size={26} strokeWidth={1.8} className="text-emerald-400" />
              <div>
                <span className="font-black text-3xl text-white leading-none">
                  {completedTopics.length}
                </span>
                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                  topic{completedTopics.length !== 1 ? 's' : ''} completed
                </p>
              </div>
            </div>
            <p className="text-white/50 font-medium text-sm hidden md:block">
              {completedTopics.length < 5
                ? "Keep going — you're just getting started!"
                : completedTopics.length < 10
                  ? 'Nice progress! Your finance game is leveling up.'
                  : "You're a FINLIT power user. Seriously impressive."}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/progress')}
            className="bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            <BarChart2 size={15} strokeWidth={2} />
            View Full Progress
            <ChevronRight size={13} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      )}

      <FloatingMentor
        currentTopic={
          typeof recommendations[0] === 'string'
            ? recommendations[0]
            : recommendations[0]?.name || 'Budgeting Basics'
        }
        nextRecommendation={recommendations[0] || null}
        userInterest={profile.primaryInterest}
        externalOpen={mentorOpen}
        onExternalClose={() => setMentorOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
