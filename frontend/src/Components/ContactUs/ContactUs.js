import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ContactUs.css';
// import Navbar from '../Navbar/Navbar';

function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error for the field being changed
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post('http://localhost:5000/api/contact', formData);
        setSuccessMessage('Thank you for your message! We will get back to you soon.');
        setTimeout(() => {
          navigate('/'); // Navigate to Main_Home page
        }, 2000);
      } catch (error) {
        setErrors({ submit: error.response?.data?.message || 'Failed to send message. Please try again.' });
      }
    }
  };

  return (
    <>
      <div className="contact-us-page">
        <h1 className="contact-us-title">Contact Us</h1>
        <div className="contact-us-form-container">
          <form onSubmit={handleSubmit} className="contact-us-form">
            <div className="contact-us-form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
              />
              {errors.name && <span className="contact-us-error">{errors.name}</span>}
            </div>
            <div className="contact-us-form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
              />
              {errors.email && <span className="contact-us-error">{errors.email}</span>}
            </div>
            <div className="contact-us-form-group">
              <label>Subject:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
              />
              {errors.subject && <span className="contact-us-error">{errors.subject}</span>}
            </div>
            <div className="contact-us-form-group">
              <label>Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
              />
              {errors.message && <span className="contact-us-error">{errors.message}</span>}
            </div>
            <button type="submit" className="contact-us-submit-btn">Send Message</button>
            {errors.submit && <p className="contact-us-error">{errors.submit}</p>}
            {successMessage && <p className="contact-us-success">{successMessage}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default ContactUs;