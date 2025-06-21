import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import clsx from 'clsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, isAuthenticated, clearError } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/mynotes';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;
    if (!email || !password) return alert('All fields are required');

    const result = await login(email, password);
    if (result.success) {
      const from = location.state?.from?.pathname || '/mynotes';
      navigate(from);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/signup"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['email', 'password'].map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {field}
              </label>
              <input
                type={field === 'password' ? 'password' : 'email'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className={clsx(
                  'input-field mt-1',
                  error && 'border-red-300 dark:border-red-600 focus:ring-red-500'
                )}
                placeholder={`Enter your ${field}`}
              />
            </div>
          ))}

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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="container text-center">
          <a href="/forgetPassword" className='text-center'>Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
