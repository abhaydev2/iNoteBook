import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AboutPage from './pages/AboutPage';
import NotesPage from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';
import RecycleBinPage from './pages/RecycleBinPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotesProvider>
          <Router>
            <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/notes" element={
                  <ProtectedRoute>
                    <NotesPage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/recycle-bin" element={
                  <ProtectedRoute>
                    <RecycleBinPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </NotesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;