import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email: user.email,
        password: user.password,
      });

      if (response.data.status === 'ok') {
        localStorage.setItem('token', response.data.token);
        alert('Login Success');
        navigate('/Home');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    if (!user.email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/forgot-password', {
        email: user.email,
        newPassword,
      });
      if (response.data.status === 'ok') {
        alert('Password updated successfully.');
        setShowForgotPassword(false);
        setNewPassword('');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred while updating the password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <div>
          <label>Email Address</label>
          <input
            type="email"
            value={user.email}
            onChange={handleInputChange}
            name="email"
            required
          />
          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={user.password}
              onChange={handleInputChange}
              name="password"
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleSubmit}>Login</button>
          <p className="forgot-password">
            <span onClick={() => setShowForgotPassword(true)}>Forgot Password?</span>
          </p>
          <button className="back-btnLogin" onClick={() => navigate('/')}>
            Back to Main_Home
          </button>
          <p className="signup-message">
            If you don't have an account, <Link to="/SignUp">Sign Up</Link>
          </p>
        </div>

        {showForgotPassword && (
          <div className="modal">
            <div className="modal-content">
              <h2>Reset Password</h2>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div className="modal-buttons">
                <button onClick={handleForgotPassword}>Submit</button>
                <button onClick={() => setShowForgotPassword(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;