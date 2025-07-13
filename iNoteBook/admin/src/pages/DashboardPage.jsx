import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import useStore from '../store/useStore';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
  const { isAuthenticated, checkAuth } = useStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checkAuth();
    setChecked(true);
    // eslint-disable-next-line
  }, []);

  if (!checked) return null; // Wait for auth check
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Dashboard />
      </main>
    </div>
  );
};

export default DashboardPage;