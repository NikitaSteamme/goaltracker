import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="container">
      <div className="content">
        <img src="https://via.placeholder.com/100" alt="Logo" className="logo" />
        <h1 className="title">Goal Tracker</h1>
        <p className="description">Track your goals and achieve more with our Goal Tracker app.</p>
        <p className="description">Create tasks, set deadlines, and monitor your progress.</p>
        <div className="invite" onClick={() => window.location.href='/signup'}>Create an Account</div>
      </div>
    </div>
  );
};

export default HomePage;