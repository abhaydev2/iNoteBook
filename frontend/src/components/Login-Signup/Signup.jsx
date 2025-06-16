import  { useState, useContext } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';

const Signup = () => {
  const [credentials, setCredentials] = useState({name:'', email: '', password: '', confirmPassword: '',});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const {name, email, password, confirmPassword}=credentials

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signing up with:', { name, email, password, confirmPassword });
  

  const response = await fetch('http://localhost:3000/api/auth/createuser', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password }),
  });
  const data = await response.json();
  console.log(data);

  if (data.success) {
    login(data.authtoken); // use context login
    navigate("/");
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
        <h2>Signup</h2>
        <div className="input-group">
          <label htmlFor="name">name</label>
          <input
            type="text"
            name="name"
            id="name"
            // value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            // value={email}
            onChange={ onChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            // value={password}
            onChange={onChange}
minLength={8}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            // value={confirmPassword}
            onChange={ onChange}
            minLength={8}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
