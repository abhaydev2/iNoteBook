import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import useStore from './store/useStore';
import Announcements from './pages/Anouncements';

function App() {
  const { initializeTheme } = useStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/send-announcement" element={<Announcements />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;