import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/`, {
        email: email,
        password: password
      });
      console.log(response.data);
      // Redirect to login page or show success message
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h1 className="signup-title">Create an Account</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="signup-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="signup-input"
          />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;