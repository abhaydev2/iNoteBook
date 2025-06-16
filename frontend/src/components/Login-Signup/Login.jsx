import { useState, useEffect, useContext } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Reset credentials when component mounts
  useEffect(() => {
    setCredentials({ email: '', password: '' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3000/api/auth/userlogin', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });
    const data = await response.json();
    console.log(data);

    if (data.success) {
      login(data.authtoken); // use context login
      navigate("/mynotes"); // redirect to /mynotes after login
    } else {
      alert('Invalid credentials');
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={credentials.email}
            onChange={onChange}
            required
          />
        </div>
        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label htmlFor="password" style={{ marginBottom: '0.3rem' }}>Password</label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={credentials.password}
              onChange={onChange}
              required
              style={{ paddingRight: '2.2rem', width: '100%' }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '0.7rem',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#4f8cff',
                fontSize: '1.2rem',
                zIndex: 2
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit" className="submit-button"  >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
