import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, X } from 'lucide-react';
import useStore from '../store/useStore';

const Announcements = () => {
  const isDarkMode = useStore(state => state.isDarkMode);
  const [formData, setFormData] = useState({
    subject: '',
    emailBody: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/send-announcement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send announcement');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
       
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Send Announcement
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Broadcast an email announcement to all registered users
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Cards */}
        {error && (
          <div className="mb-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 flex items-center justify-between">
              <div className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 flex items-center justify-between">
              <div className="flex items-center">
                <Send className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm text-green-700 dark:text-green-400">
                  Announcement sent successfully! Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject Line
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm
                placeholder-gray-400 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                dark:text-white transition duration-150 ease-in-out"
                placeholder="Enter a clear and concise subject line"
              />
            </div>

            <div>
              <label htmlFor="emailBody" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message Content
              </label>
              <div className="mt-1">
                <textarea
                  id="emailBody"
                  name="emailBody"
                  value={formData.emailBody}
                  onChange={handleChange}
                  required
                  rows="8"
                  className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm
                  placeholder-gray-400 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  dark:text-white transition duration-150 ease-in-out resize-none"
                  placeholder="Compose your announcement message here..."
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Your message will be sent to all registered users. HTML formatting is supported.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md 
                text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                <X className="h-4 w-4 mr-1.5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white 
                bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition duration-150 ease-in-out ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                <Send className="h-4 w-4 mr-1.5" />
                {loading ? 'Sending...' : 'Send Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
