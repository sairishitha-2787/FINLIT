import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { ToastProvider } from './context/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { DomainProvider } from './contexts/DomainContext';
import ProtectedRoute from './components/ProtectedRoute';
import ClickSpark from './components/effects/ClickSpark';
import Welcome from './pages/Welcome';
import Landing from './pages/Landing';
import NotificationCenter from './pages/NotificationCenter';
import Glossary from './pages/Glossary';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Learning from './pages/Learning';
import Progress from './pages/Progress';
import GamingLayout from './layouts/GamingLayout';
import GamingDashboard from './pages/gaming/GamingDashboard';
import GamingMap from './pages/gaming/GamingMap';
import GamingProgressPage from './pages/gaming/GamingProgressPage';
import GamingAchievementsPage from './pages/gaming/GamingAchievementsPage';
import GamingSettings from './pages/gaming/GamingSettings';
import FashionLayout from './layouts/FashionLayout';
import FashionDashboard from './pages/fashion/FashionDashboard';
import FashionMap from './pages/fashion/FashionMap';
import FashionLearning from './pages/fashion/FashionLearning';
import FashionProgressPage from './pages/fashion/FashionProgressPage';
import FashionBadgesPage from './pages/fashion/FashionBadgesPage';
import FashionSettings from './pages/fashion/FashionSettings';
import { FashionProvider } from './contexts/FashionContext';
import SportsLayout from './layouts/SportsLayout';
import SportsDashboard from './pages/sports/SportsDashboard';
import SportsMap from './pages/sports/SportsMap';
import SportsProgressPage from './pages/sports/SportsProgressPage';
import SportsBadgesPage from './pages/sports/SportsBadgesPage';
import { SportsProvider } from './contexts/SportsContext';
import SportsLearning from './pages/sports/SportsLearning';
import SportsSettings from './pages/sports/SportsSettings';
import MusicLayout from './layouts/MusicLayout';
import MusicDashboard from './pages/music/MusicDashboard';
import MusicPlaybook from './pages/music/MusicPlaybook';
import MusicLearning from './pages/music/MusicLearning';
import MusicVault from './pages/music/MusicVault';
import MusicCharts from './pages/music/MusicCharts';
import MusicMixer from './pages/music/MusicMixer';
import MusicBossBattle from './pages/music/MusicBossBattle';
import VinylRecords from './pages/music/VinylRecords';
import NeonGlitch from './pages/music/NeonGlitch';
import DreamyForest from './pages/music/DreamyForest';
import { MusicProvider } from './contexts/MusicContext';

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <UserProvider>
        <ToastProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ClickSpark
            sparkColor="#ffffff"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
            easing="ease-out"
            extraScale={1}
          />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning"
              element={
                <ProtectedRoute>
                  <Learning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/glossary"
              element={
                <ProtectedRoute>
                  <Glossary />
                </ProtectedRoute>
              }
            />

            {/* Gaming domain — all nested routes share the layout wrapper */}
            <Route
              path="/gaming"
              element={
                <ProtectedRoute>
                  <DomainProvider>
                    <GamingLayout />
                  </DomainProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<GamingDashboard />} />
              <Route path="map" element={<GamingMap />} />
              <Route path="progress" element={<GamingProgressPage />} />
              <Route path="achievements" element={<GamingAchievementsPage />} />
              <Route path="learn" element={<Learning />} />
              <Route path="settings" element={<GamingSettings />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Fashion domain */}
            <Route
              path="/fashion"
              element={
                <ProtectedRoute>
                  <FashionProvider>
                    <FashionLayout />
                  </FashionProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<FashionDashboard />} />
              <Route path="map" element={<FashionMap />} />
              <Route path="learn" element={<FashionLearning />} />
              <Route path="progress" element={<FashionProgressPage />} />
              <Route path="achievements" element={<FashionBadgesPage />} />
              <Route path="settings" element={<FashionSettings />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Sports domain */}
            <Route
              path="/sports"
              element={
                <ProtectedRoute>
                  <SportsProvider>
                    <SportsLayout />
                  </SportsProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<SportsDashboard />} />
              <Route path="playbook" element={<SportsMap />} />
              <Route path="progress" element={<SportsProgressPage />} />
              <Route path="achievements" element={<SportsBadgesPage />} />
              <Route path="learn" element={<SportsLearning />} />
              <Route path="settings" element={<SportsSettings />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Music domain */}
            <Route
              path="/music"
              element={
                <ProtectedRoute>
                  <MusicProvider>
                    <MusicLayout />
                  </MusicProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<MusicDashboard />} />
              <Route path="setlist"       element={<MusicPlaybook />} />
              <Route path="learn"         element={<MusicLearning />} />
              <Route path="vault"         element={<MusicVault />} />
              <Route path="charts"        element={<MusicCharts />} />
              <Route path="mixer"         element={<MusicMixer />} />
              <Route path="boss/:bossId"  element={<MusicBossBattle />} />
              <Route path="vinyl"         element={<VinylRecords />} />
              <Route path="neon"          element={<NeonGlitch />} />
              <Route path="forest"        element={<DreamyForest />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        </ToastProvider>
      </UserProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
