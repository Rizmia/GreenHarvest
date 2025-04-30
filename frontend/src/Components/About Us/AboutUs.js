import React from 'react';
import './AboutUs.css';

// Import images from the same folder
import impact1 from './impact-1.jpg'; 
import impact2 from './impact-2.jpg'; 
import mission from './mission.jpg';  

const AboutUs = () => {
  return (
    <div className="aboutUs-container">
      
      {/* Hero Section */}
      <section className="aboutUs-hero-section">
        <div className="aboutUs-hero-content">
          <h1>ABOUT US</h1>
          <p>Green Harvest: Empowering Sustainable Agriculture</p>
          <p>Join us in making a difference with sustainable farming practices that benefit farmers and the environment.</p>
          <button className="aboutUs-btn-learn-more">Discover Our Story</button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="aboutUs-mission-section">
        <div className="aboutUs-mission-content">
          <h2>Our Mission</h2>
          <p>We strive to create a more sustainable world through eco-friendly farming, empowering local farmers, and nurturing the environment.</p>
          <img src={mission} alt="Our Mission" />
        </div>
      </section>

      {/* Impact Section */}
      <section className="aboutUs-impact-section">
        <h2>Our Impact</h2>
        <div className="aboutUs-impact-cards">
          <div className="aboutUs-impact-card">
            <img src={impact1} alt="Impact 1" />
            <h3>Supporting Farmers</h3>
            <p>We help farmers improve their productivity and promote sustainable practices that reduce environmental impact.</p>
          </div>
          <div className="aboutUs-impact-card">
            <img src={impact2} alt="Impact 2" />
            <h3>Eco-Friendly Practices</h3>
            <p>Through sustainable farming methods, we reduce our carbon footprint and promote biodiversity.</p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="aboutUs-values-section">
        <h2>Our Core Values</h2>
        <div className="aboutUs-values-cards">
          <div className="aboutUs-values-card">
            <h3>Integrity</h3>
            <p>We believe in transparency and ethical practices in all our initiatives.</p>
          </div>
          <div className="aboutUs-values-card">
            <h3>Sustainability</h3>
            <p>Our focus is on long-term solutions that benefit the environment and future generations.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="aboutUs-cta-section">
        <h2>Be Part of the Change</h2>
        <button className="aboutUs-btn-cta">Join Us</button>
      </section>
    </div>
  );
};

export default AboutUs;

