// src/pages/Home.js
import React from 'react';
import Navbar from './Navbar';  // Same directory, so use './'
import Footer from './Footer';  // Same directory, so use './'
import '../Styles/Home.css'; // If Home.css is in src/styles/

const Home = () => {
  return (
    <div className="home-container">
     <Navbar/>
      <main className="main-content">
        <section className="hero">
          <h1>Welcome to Green Harvest Website</h1>
          <p>Your one-stop solution for amazing content</p>
          <button className="cta-button">Get Started</button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;