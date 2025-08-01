import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import clsx from 'clsx';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { signup, loading, error, isAuthenticated, clearError } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/mynotes', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullname, email, password } = formData;
    if (!fullname || !email || !password) return alert('All fields are required');
    if (password.length < 6) return alert('Password must be at least 6 characters');
    const result = await signup(email, password, fullname);
    if (result.success) navigate('/mynotes');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className={clsx(
                'input-field mt-1',
                error && 'border-red-300 dark:border-red-600 focus:ring-red-500'
              )}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={clsx(
                'input-field mt-1',
                error && 'border-red-300 dark:border-red-600 focus:ring-red-500'
              )}
              placeholder="Enter your email"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={clsx(
                'input-field mt-1 pr-10',
                error && 'border-red-300 dark:border-red-600 focus:ring-red-500'
              )}
              placeholder="Enter password"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-9 text-gray-500 dark:text-gray-300 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0m2.021-2.021A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-1.657.336-3.236.938-4.675M9.879 9.879A3 3 0 0115 12m-6 0a3 3 0 016 0m-6 0a3 3 0 006 0" /></svg>
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-100 p-2 rounded">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={clsx(
              'w-full py-3 px-4 rounded-lg text-white text-sm font-medium',
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
            )}
          >
            {loading ? 'Creatin Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
