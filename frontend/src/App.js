import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails'; // Import TaskDetails component
import HomePage from './components/HomePage';
import UserList from './components/UserList';
import Header from './components/Header'; // Import Header component

function App() {
  return (
    <Router>
      <Header /> {/* Add Header component */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/task/new" element={<TaskForm />} />
        <Route path="/task/:id" element={<TaskDetails />} /> {/* Add route for TaskDetails */}
        <Route path="/users" element={<UserList />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;