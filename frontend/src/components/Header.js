import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserEmail(response.data.email);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Goal Tracker</h1>
        <div className="header-links">
          {userEmail ? (
            <span className="user-email">{userEmail}</span>
          ) : (
            <>
              <Link to="/login" className="header-link">Login</Link>
              <Link to="/signup" className="header-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;