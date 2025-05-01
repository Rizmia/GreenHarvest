import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaArrowLeft } from 'react-icons/fa'; // Importing back arrow icon
import './SignUp.css';

function SignUp() {
  const history = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    number: "",
  });

  const [errors, setErrors] = useState({
    passwordMismatch: false,
    weakPassword: false,
    phoneInvalid: false,
    emailExists: false,
  });

  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    return strongPasswordRegex.test(password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));

    if (name === 'password') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        weakPassword: !isStrongPassword(value) && value.length > 0,
      }));
    }

    if (name === 'cpassword') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordMismatch: value !== user.password && value.length > 0,
      }));
    }

    if (name === 'number') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneInvalid: value.length > 0 && value.length !== 10,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errors.passwordMismatch || errors.weakPassword || errors.phoneInvalid) {
      alert("Please fix the errors before submitting.");
      return;
    }

    sendRequest()
      .then((response) => {
        if (response.status === "ok") {
          alert("Register Success");
          history("/Home");
        } else {
          if (response.message === "Email already in use") {
            setErrors((prevErrors) => ({ ...prevErrors, emailExists: true }));
          } else {
            alert("Registration failed: " + response.message);
          }
        }
      })
      .catch((err) => {
        alert("Error: " + err.message);
      });
  };

  const sendRequest = async () => {
    return await axios.post("http://localhost:5000/register", {
      name: String(user.name),
      email: String(user.email),
      password: String(user.password),
      cpassword: String(user.cpassword),
      number: String(user.number),
    }).then((res) => res.data);
  };

  return (
    <div className="signup-container">
      <button 
        className="back-button" 
        onClick={() => history('/')}
      >
        <FaArrowLeft /> Back to Home
      </button>
      <div className="signup-form">
        <h1>User Register</h1>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={user.name}
            onChange={handleInputChange}
            name="name"
            required
          />
          
          <label>Email Address</label>
          <input
            type="email"
            value={user.email}
            onChange={handleInputChange}
            name="email"
            required
          />
          {errors.emailExists && <p className="error-message">This email is already in use. Please use another email.</p>}
          
          <label>Password</label>
          <input
            type="password"
            value={user.password}
            onChange={handleInputChange}
            name="password"
            required
            placeholder="Enter a strong password (8+ chars, with symbols)"
          />
          {errors.weakPassword && <p className="error-message">Password must be 8+ characters with at least one symbol.</p>}
          
          <label>Confirm Password</label>
          <input
            type="password"
            value={user.cpassword}
            onChange={handleInputChange}
            name="cpassword"
            required
          />
          {errors.passwordMismatch && <p className="error-message">Passwords are different.</p>}
          
          <label>Phone Number</label>
          <input
            type="number"
            value={user.number}
            onChange={handleInputChange}
            name="number"
            required
          />
          {errors.phoneInvalid && <p className="error-message">Phone number must be exactly 10 digits.</p>}
          
          <button onClick={handleSubmit}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;