import { useState } from 'react';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';

const Settings = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('addAdmin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswords, setShowPasswords] = useState({
    addAdmin: false,
    current: false,
    new: false
  });
  const [addAdminForm, setAddAdminForm] = useState({ email: '', password: '' });
  const [updatePasswordForm, setUpdatePasswordForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: ''
  });

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5000/api/admin/add-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(addAdminForm)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Admin added successfully!' });
        setAddAdminForm({ email: '', password: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add admin' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add admin' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5000/api/admin/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatePasswordForm)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setUpdatePasswordForm({ email: '', currentPassword: '', newPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 py-4 px-6 text-base font-medium ${
              activeTab === 'addAdmin'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('addAdmin')}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="h-4 w-4" />
              Add Admin
            </div>
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'updatePassword'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('updatePassword')}
          >
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-4 w-4" />
              Update Password
            </div>
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`m-4 p-3 rounded-md ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {activeTab === 'addAdmin' ? (
            <form onSubmit={handleAddAdmin} className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={addAdminForm.email}
                  onChange={(e) =>
                    setAddAdminForm({ ...addAdminForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter admin email address"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.addAdmin ? "text" : "password"}
                    required
                    value={addAdminForm.password}
                    onChange={(e) =>
                      setAddAdminForm({ ...addAdminForm, password: e.target.value })
                    }
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pr-12"
                    placeholder="Enter a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, addAdmin: !prev.addAdmin }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showPasswords.addAdmin ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Password should be at least 8 characters long
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Adding...' : 'Add Admin'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={updatePasswordForm.email}
                  onChange={(e) =>
                    setUpdatePasswordForm({ ...updatePasswordForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    required
                    value={updatePasswordForm.currentPassword}
                    onChange={(e) =>
                      setUpdatePasswordForm({
                        ...updatePasswordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pr-12"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    required
                    value={updatePasswordForm.newPassword}
                    onChange={(e) =>
                      setUpdatePasswordForm({
                        ...updatePasswordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
