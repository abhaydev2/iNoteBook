import React, { useState } from 'react';
import { User, Moon, Sun, LogOut, Trash2, Download, Upload, Shield, Bell } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNotes } from '../contexts/NotesContext';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { notes, deletedNotes } = useNotes();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleExportNotes = () => {
    const dataToExport = {
      notes: notes,
      deletedNotes: deletedNotes,
      exportDate: new Date().toISOString(),
      user: user?.name
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `notebook-abhay-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
  };

  const handleImportNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        // In a real app, you would merge or replace the existing notes
        console.log('Imported data:', importedData);
        alert('Notes imported successfully! (This is a demo - in a real app, notes would be merged)');
      } catch (error) {
        alert('Error importing notes. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and app settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-6">
              <div className="flex items-center mb-6">
                {isDarkMode ? (
                  <Moon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                ) : (
                  <Sun className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                )}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Switch between light and dark themes
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Management</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Export Notes</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Download all your notes as a backup</p>
                  </div>
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Import Notes</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Import notes from a backup file</p>
                  </div>
                  <label className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Import</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportNotes}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Statistics</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{notes.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Notes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {notes.filter(n => n.category === 'personal').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Personal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {notes.filter(n => n.category === 'work').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Work</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{deletedNotes.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Deleted</div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-red-200/50 dark:border-red-700/50">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <LogOut className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
                <h2 className="text-xl font-semibold text-red-900 dark:text-red-300">Account Actions</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div>
                    <h3 className="text-sm font-medium text-red-900 dark:text-red-300">Sign Out</h3>
                    <p className="text-xs text-red-700 dark:text-red-400">Sign out of your account</p>
                  </div>
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center">
                <LogOut className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Sign Out
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to sign out of your account?
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2 px-4 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Confirmation Modal */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center">
                <Download className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Export Notes
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This will download all your notes and deleted notes as a JSON file.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleExportNotes}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsPage;