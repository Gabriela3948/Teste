import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './hooks/useUser';
import Layout from './components/layout/Layout';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import DailyTrackingPage from './pages/DailyTrackingPage';
import ReportsPage from './pages/ReportsPage';
import GoalsPage from './pages/GoalsPage';
import ProfilePage from './pages/ProfilePage';
import LoadingScreen from './components/layout/LoadingScreen';

function AppRoutes() {
  const { user, loading, login, refreshUser } = useUser();

  if (loading) return <LoadingScreen />;
  if (!user || !user.onboarding_completed) {
    return <OnboardingPage onComplete={login} existingUser={user} />;
  }

  return (
    <BrowserRouter>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/tracking" element={<DailyTrackingPage user={user} />} />
          <Route path="/tracking/:date" element={<DailyTrackingPage user={user} />} />
          <Route path="/reports" element={<ReportsPage user={user} />} />
          <Route path="/goals" element={<GoalsPage user={user} onRefresh={refreshUser} />} />
          <Route path="/profile" element={<ProfilePage user={user} onRefresh={refreshUser} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppRoutes />;
}
