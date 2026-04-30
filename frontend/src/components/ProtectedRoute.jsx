import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { onboardingComplete, loading: userLoading } = useUser();

  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-cosmic-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-cosmic-purple border-t-cosmic-cyan rounded-full animate-spin" />
          <p className="text-cosmic-white/50 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />;

  return children;
};

export default ProtectedRoute;
