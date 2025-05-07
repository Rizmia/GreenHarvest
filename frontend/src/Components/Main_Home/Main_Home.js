import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundVideo from '../../Videos/Home.mp4';
import './Main_Home.css';

function Main_Home() {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/SignUp');
  };

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleContactUsClick = () => {
    navigate('/ContactUs');
  };

  return (
    <div className="main-home-container">
      <video className="background-video" src={backgroundVideo} autoPlay muted loop />
      <div className="main-home-content">
        <h1>Welcome to Crop Records</h1>
        <p className="CM1">Manage your agricultural data with ease.</p>
        <div className="agriculture-info">
          <p>Track crop yields, monitor soil health, and optimize farming practices.</p>
        </div>
        <div className="auth-buttons">
          <button onClick={handleSignUpClick}>Sign Up</button>
          <button onClick={handleLoginClick}>Login</button>
        </div>
      </div>
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>We provide tools to help farmers manage their agricultural data efficiently.</p>
          </div>
          <div className="footer-section">
            <button onClick={handleContactUsClick}>Contact Us</button>
            <p>Email: support@croprecords.com</p>
            <p>Phone: +94 123 456 789</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Main_Home;