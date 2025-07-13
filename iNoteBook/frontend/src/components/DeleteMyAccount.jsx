import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const DeleteMyAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleDeleteAccount = async () => {
    // Show a confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/delete-my-account',
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Clear auth state before navigating
        await logout();
        // Redirect to login page after successful deletion
        navigate('/login');
      } else {
        // If the response wasn't successful, show the error message
        alert(response.data.error || 'Failed to delete account');
        window.location.reload(); // Refresh the page
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(error.response?.data?.error || 'Failed to delete account');
      window.location.reload(); // Refresh the page if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-red-700 font-medium">
            Delete your account and all associated data
          </p>
          <p className="text-red-600 text-sm mt-1">
            This action is permanent and cannot be undone
          </p>
        </div>
        <button
          onClick={handleDeleteAccount}
          disabled={isLoading}
          className={`ml-4 px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
};

export default DeleteMyAccount;
