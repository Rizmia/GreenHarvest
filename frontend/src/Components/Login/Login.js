import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Login.css';

function Login() {
  const history = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.status === "ok") {
        alert("Login Success");
        history("/Home");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
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
          <input
            type="password"
            value={user.password}
            onChange={handleInputChange}
            name="password"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleSubmit}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;